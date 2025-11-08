# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from pathlib import Path
import os

# --- Load environment variables from backend/.env ---
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(docs_url="/docs", redoc_url="/redoc")

# --- Allow frontend requests (dev setup: open CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔒 tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Root (so / doesn’t show “Not Found”) ---
@app.get("/")
def root():
    return {"message": "GuideWithin API running. See /docs for Swagger UI."}

# --- Health check ---
@app.get("/health")
def health():
    return {"status": "ok"}

# --- Environment check (safe: masks your key) ---
@app.get("/env-check")
def env_check():
    key = os.getenv("EXPO_PUBLIC_OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not key:
        return {"hasKey": False}
    masked = f"{key[:4]}...{key[-4:]}" if len(key) >= 8 else "****"
    which = "EXPO_PUBLIC_OPENAI_API_KEY" if os.getenv("EXPO_PUBLIC_OPENAI_API_KEY") else "OPENAI_API_KEY"
    return {"hasKey": True, "which": which, "preview": masked}

# --- Request body model (existing) ---
class ChatRequest(BaseModel):
    chakra: str
    notes: str | None = None

# --- Chakra chat endpoint (existing) ---
@app.post("/api/chat")
async def chat(req: ChatRequest):
    """
    Returns chakra insights: mock if no key, real OpenAI if key exists.
    """
    key = os.getenv("EXPO_PUBLIC_OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY")

    # ✅ fallback mock mode (safe for testing)
    if not key:
        return {
            "message": f"(mock) Insight for {req.chakra}",
            "notesEcho": (req.notes or "")[:80]
        }

    # ✅ OpenAI mode
    try:
        client = OpenAI(api_key=key)
        prompt = (
            "You are a compassionate chakra mentor.\n"
            f"Chakra: {req.chakra}\n"
            f"Notes: {req.notes or '(none)'}\n\n"
            "Reply with: 1 breath suggestion, 1 short mini-meditation or pose, "
            "and 1 gentle affirmation. Keep it concise and kind."
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Be concise, kind, and practical."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        return {"message": response.choices[0].message.content.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)[:150]}")

# --- Mount the new API routes (prompt/insights/mentor/community/calendar/tarot) ---
from routes import router  # ← routes.py in the same folder
app.include_router(router)
