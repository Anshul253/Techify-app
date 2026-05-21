from dotenv import load_dotenv
load_dotenv()
from google import genai
from google.genai import types

client = genai.Client()
try:
    print("Testing generate_content...")
    res = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="hello",
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0)
        )
    )
    print("Success!", res.text)
except Exception as e:
    print("Failed:", e)
