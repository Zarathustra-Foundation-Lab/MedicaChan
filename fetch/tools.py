tools = [
    {
        "type": "function",
        "function": {
            "name": "register_user",
            "description": (
                "Create and register a new user health profile in the system. "
                "Use this whenever the user wants to sign up, create an account, or provide personal health information. "
                "The profile includes full name, age, gender, body metrics, and optional medical history (allergies, chronic diseases)."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {
                        "type": "string",
                        "description": "The unique principal ID of the user (from Internet Identity)."
                    },
                    "full_name": {
                        "type": "string",
                        "description": "The user's full name."
                    },
                    "age": {
                        "type": "number",
                        "description": "The user's age in years."
                    },
                    "gender": {
                        "type": "string",
                        "description": "The user's gender (Male, Female, Other)."
                    },
                    "height_cm": {
                        "type": "number",
                        "description": "Height in centimeters (optional)."
                    },
                    "weight_kg": {
                        "type": "number",
                        "description": "Weight in kilograms (optional)."
                    },
                    "allergies": {
                        "type": "string",
                        "description": "Known allergies (optional)."
                    },
                    "chronic_diseases": {
                        "type": "string",
                        "description": "Chronic diseases or medical history (optional)."
                    }
                },
                "required": ["principal", "full_name", "age", "gender"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_checkup",
            "description": (
                "Record a new daily health checkup for a user. "
                "Use this when the user provides health vitals such as temperature, blood pressure, mood, or sleep. "
                "The data is stored privately by default until explicitly published."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {
                        "type": "string",
                        "description": "The principal ID of the user."
                    },
                    "data": {
                        "type": "object",
                        "properties": {
                            "temperature": {"type": "number", "description": "Body temperature in °C."},
                            "blood_pressure": {"type": "string", "description": "Blood pressure in systolic/diastolic format (e.g., '120/80')."},
                            "heart_rate": {"type": "number", "description": "Heart rate in beats per minute."},
                            "respiration_rate": {"type": "number", "description": "Breathing rate per minute (optional)."},
                            "sleep_hours": {"type": "number", "description": "Number of hours slept (optional)."},
                            "mood": {"type": "string", "description": "Mood state (e.g., Happy, Stressed, Normal)."},
                            "activity_level": {"type": "string", "description": "Activity level (Low, Moderate, High)."},
                            "note": {"type": "string", "description": "Additional notes or remarks."},
                            "photo_url": {"type": "string", "description": "Optional photo URL of the checkup (e.g., uploaded image)."}
                        },
                        "required": ["temperature", "blood_pressure", "heart_rate", "mood", "note"]
                    }
                },
                "required": ["principal", "data"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "publish_checkup",
            "description": (
                "Make a previously recorded checkup public. "
                "Once published, the checkup cannot be reverted back to private. "
                "The user receives reward points when publishing."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {"type": "string", "description": "The principal ID of the user."},
                    "checkup_id": {"type": "string", "description": "The unique ID of the checkup to publish."}
                },
                "required": ["principal", "checkup_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "reward_user",
            "description": (
                "Increase a user's reward balance by a specified number of points. "
                "Use this to grant additional rewards manually or as part of an incentive system."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {"type": "string", "description": "The principal ID of the user."},
                    "points": {"type": "number", "description": "Number of reward points to add."}
                },
                "required": ["principal", "points"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_user_profile",
            "description": (
                "Retrieve the full profile of a user, including personal info, medical history, rewards, and checkup data. "
                "Use this when the user asks to view their profile or account details."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {"type": "string", "description": "The principal ID of the user."}
                },
                "required": ["principal"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_public_data",
            "description": (
                "Retrieve all public health checkups across all users. "
                "Use this when the user requests shared/public health information."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_private_data",
            "description": (
                "Retrieve all private checkups of a user. "
                "Accessible only with the correct principal (owner)."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {"type": "string", "description": "The principal ID of the user."}
                },
                "required": ["principal"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_user_history",
            "description": (
                "Get the complete health checkup history of a user (both public and private). "
                "Use this when the user asks for all their past checkups."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "principal": {"type": "string", "description": "The principal ID of the user."}
                },
                "required": ["principal"]
            }
        }
    }
]