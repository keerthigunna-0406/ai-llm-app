from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os  # ✅ THIS is what was missing

load_dotenv()

app = FastAPI()

# CORS for dev 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set API key from environment
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# Request body model
class PromptRequest(BaseModel):
    prompt: str

# POST endpoint
@app.post("/generate")
async def generate_text(request: PromptRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": request.prompt},
            ]
        )
    return {"response": response.choices[0].message.content}

    except Exception as e:
        return {"error": str(e)}