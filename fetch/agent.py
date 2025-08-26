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
CANISTER_ID = os.getenv("CANISTER_ID") or "your_canister_id"  # ganti sesuai canister ID
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
        # Step 1: Initial call ke ASI1
        # Add explicit instruction for tool usage
        enhanced_query = f"""
        You are a health assistant with access to health management tools. 
        When users ask about registering, adding checkups, viewing profiles, or accessing health data, 
        you MUST use the appropriate tools.
        
        User query: {query}
        
        Available tools:
        - register_user: for new user registration
        - add_checkup: for recording health vitals
        - get_user_profile: for viewing user info
        - get_public_data: for public health data
        - get_private_data: for private health data
        - publish_checkup: for making checkups public
        - reward_user: for adding reward points
        
        Variable Parameter:
        - principal: define as [GENERATE_UUID] if defined you can skip this variable

        Please analyze the user's request and use the appropriate tool(s) and Focus return which tools to use.
        Dont ask about user principal IDs.
        """
        system_message = {
            "role": "system",
            "content": (
                "You are a health assistant with access to function tools. "
                "You MUST call tools when the user asks to register, add checkups, view profiles, or access health data. "
                "Always prefer tool calls over free-text answers when applicable."
                "Principal IDs are UUID strings, if Blank generate new UUID"
            ),
        }
        
        initial_message = {"role": "user", "content": enhanced_query}
        payload = {
            "model": "asi1-mini",
            "messages": [system_message, initial_message],
            "tools": tools,
            "temperature": 0.7,
            "max_tokens": 1024
        }
        
        # DEBUG: Log the payload being sent
        ctx.logger.info(f"Sending payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{ASI1_BASE_URL}/chat/completions",
            headers=ASI1_HEADERS,
            json=payload
        )
        response.raise_for_status()
        response_json = response.json()
        
        # DEBUG: Log the full response
        ctx.logger.info(f"ASI1 Response: {json.dumps(response_json, indent=2)}")

        # Step 2: Ambil tool calls
        tool_calls = response_json["choices"][0]["message"].get("tool_calls", [])
        messages_history = [initial_message, response_json["choices"][0]["message"]]

        if not tool_calls:
            return "⚠️ I couldn't determine which health action to take. Please try rephrasing."

        # Step 3: Eksekusi tools
        for tool_call in tool_calls:
            func_name = tool_call["function"]["name"]
            arguments = json.loads(tool_call["function"]["arguments"])
            tool_call_id = tool_call["id"]

            ctx.logger.info(f"Executing {func_name} with args: {arguments}")

            try:
                result = await call_icp_endpoint(ctx, func_name, arguments)
                content_to_send = json.dumps(result)
            except Exception as e:
                error_content = {"error": f"Tool exec failed: {str(e)}"}
                content_to_send = json.dumps(error_content)

            tool_result_message = {
                "role": "tool",
                "tool_call_id": tool_call_id,
                "content": content_to_send
            }
            messages_history.append(tool_result_message)

        # Step 4: Final call ke ASI1 untuk natural answer
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
