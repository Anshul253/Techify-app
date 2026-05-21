from dotenv import load_dotenv
load_dotenv()
from google import genai
client = genai.Client()
models = ['gemini-2.0-flash-lite-001', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-flash']
for m in models:
    try:
        client.models.generate_content(model=m, contents='hello')
        print(f"Success: {m}")
        break
    except Exception as e:
        print(f"Failed {m}: {e}")
