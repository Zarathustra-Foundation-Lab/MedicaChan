import requests
import json
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    StartSessionContent,    
)


from uagents import Agent, Context, Protocol
from datetime import datetime, timezone
from uuid import uuid4

import os
from dotenv import load_dotenv

# load env
load_dotenv()

# get env


# ASI1 API settings
ASI1_API_KEY = os.getenv("ASI1_API_KEY") or "your_asi1_api_key"  # Ganti dengan API key dari asi1.ai
ASI1_BASE_URL = "https://api.asi1.ai/v1"
ASI1_HEADERS = {
    "Authorization": f"Bearer {ASI1_API_KEY}",
    "Content-Type": "application/json"
}

# ICP local backend config
CANISTER_ID = os.getenv("BACKEND_CANISTER_ID") or "your_canister_id"  # ganti sesuai canister ID
BASE_URL = "http://127.0.0.1:4943"
HEADERS = {
    "Host": f"{CANISTER_ID}.localhost",
    "Content-Type": "application/json"
}

print("ASI1 API Key: ", ASI1_API_KEY)
print("\n")
print("Canister ID Running: ", CANISTER_ID)

# =====================================================================
# TOOLS DEFINITIONS (mapping Rust canister functions ke tool ASI1)
# =====================================================================
from tools import tools

# =====================================================================
# CALL ICP ENDPOINT
# =====================================================================
async def call_icp_endpoint(ctx: Context, func_name: str, args: dict):
    # mapping nama function jadi endpoint REST
    url = f"{BASE_URL}/{func_name.replace('_', '-')}"
    # url = f"{BASE_URL}??canisterId={CANISTER_ID}/{func_name}"
    
    # debug url
    ctx.logger.info(f"Calling ICP endpoint: {url}")
    
    # debug body
    ctx.logger.info(f"Calling ICP endpoint with body: {json.dumps(args, indent=2)}")

    response = requests.post(url, headers=HEADERS, json=args)
    response.raise_for_status()
    
    # debug response
    ctx.logger.info(f"Calling ICP endpoint with response: {json.dumps(response.json(), indent=2)}")

    return response.json()

# =====================================================================
# PROCESS QUERY (user -> asi1 -> tools -> icp -> asi1 -> user)
# =====================================================================
async def process_query(query: str, ctx: Context) -> str:
    try:
        system_message = {
            "role": "system",
            "content": (
                "You are a health assistant with access to function tools. "
                "You MUST ALWAYS use one of the available tools when the user asks "
                "to register, add checkups, view profiles, or access health data. "
                "If the query is vague (like hello/hi/halo), DEFAULT to calling get_public_data. "
                "Never reply with 'I couldn't determine' — always choose an action."
            ),
        }
        initial_message = {"role": "user", "content": query}
        payload = {
            "model": "asi1-mini",
            "messages": [system_message, initial_message],
            "tools": tools,
            "temperature": 0.7,
            "max_tokens": 1024
        }

        ctx.logger.info(f"Sending payload: {json.dumps(payload, indent=2)}")
        response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=payload
        )
        response.raise_for_status()
        response_json = response.json()
        ctx.logger.info(f"ASI1 Response: {json.dumps(response_json, indent=2)}")

        # --- Ambil tool calls ---
        tool_calls = response_json["choices"][0]["message"].get("tool_calls", [])
        messages_history = [initial_message, response_json["choices"][0]["message"]]

        # --- Fallback kalau kosong ---
        if not tool_calls:
            ctx.logger.warning("No tool_calls detected → fallback to get_public_data")
            try:
                result = await call_icp_endpoint(ctx, "get_public_data", {})
                return json.dumps(result, default=str)
            except Exception as e:
                return f"⚠️ AI gave no tool call and fallback failed: {str(e)}"

        # --- Eksekusi tool(s) ---
        for tool_call in tool_calls:
            func_name = tool_call["function"]["name"]
            arguments = json.loads(tool_call["function"]["arguments"])
            tool_call_id = tool_call["id"]

            ctx.logger.info(f"Executing {func_name} with args: {arguments}")
            try:
                result = await call_icp_endpoint(ctx, func_name, arguments)
                content_to_send = json.dumps(result, default=str)
            except Exception as e:
                content_to_send = json.dumps({"error": f"Tool exec failed: {str(e)}"})

            tool_result_message = {
                "role": "tool",
                "tool_call_id": tool_call_id,
                "content": content_to_send
            }
            messages_history.append(tool_result_message)

        # --- Final call balik ke ASI1 untuk natural language ---
        final_payload = {
            "model": "asi1-mini",
            "messages": messages_history,
            "temperature": 0.7,
            "max_tokens": 1024
        }
        final_response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=final_payload
        )
        final_response.raise_for_status()
        final_response_json = final_response.json()

        return final_response_json["choices"][0]["message"]["content"]

    except Exception as e:
        ctx.logger.error(f"Error processing query: {str(e)}")
        return f"❌ Error: {str(e)}"

# =====================================================================
# AGENT SETUP
# =====================================================================
agent = Agent(
    name='MedicaChan-ICP-agent',
    port=8001,
    mailbox=True
)
chat_proto = Protocol(spec=chat_protocol_spec)

@chat_proto.on_message(model=ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    try:
        ack = ChatAcknowledgement(
            timestamp=datetime.now(timezone.utc),
            acknowledged_msg_id=msg.msg_id
        )
        await ctx.send(sender, ack)

        for item in msg.content:
            if isinstance(item, StartSessionContent):
                ctx.logger.info(f"Start session from {sender}")
                continue
            elif isinstance(item, TextContent):
                ctx.logger.info(f"Msg from {sender}: {item.text}")
                response_text = await process_query(item.text, ctx)
                response = ChatMessage(
                    timestamp=datetime.now(timezone.utc),
                    msg_id=uuid4(),
                    content=[TextContent(type="text", text=response_text)]
                )
                await ctx.send(sender, response)
            else:
                ctx.logger.info(f"Unexpected content from {sender}")
    except Exception as e:
        ctx.logger.error(f"Error handling message: {str(e)}")
        error_response = ChatMessage(
            timestamp=datetime.now(timezone.utc),
            msg_id=uuid4(),
            content=[TextContent(type="text", text=f"❌ Error: {str(e)}")]
        )
        await ctx.send(sender, error_response)

@chat_proto.on_message(model=ChatAcknowledgement)
async def handle_chat_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Ack from {sender} for {msg.acknowledged_msg_id}")

agent.include(chat_proto)

if __name__ == "__main__":
    agent.run()


"""
🧾 Queries for /register_user
Register me as Budi, 25 years old, male, height 170, weight 65.

🧾 Queries for /add_checkup
Add checkup: temp 37.2, blood pressure 120/80, HR 75, mood happy.

🧾 Queries for /publish_checkup
Publish my last checkup with ID=abcd-1234.

🧾 Queries for /get_user_profile
Show my profile with principal=aaaa-bbbb-cccc-dddd.

🧾 Queries for /get_public_data
Show me all public health checkups.
"""
