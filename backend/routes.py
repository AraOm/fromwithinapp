# backend/routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from openai import OpenAI
import os, random

router = APIRouter()

# ------------------ OpenAI helpers ------------------

def get_openai_client() -> Optional[OpenAI]:
    """
    Uses EXPO_PUBLIC_OPENAI_API_KEY or OPENAI_API_KEY.
    Returns None if no key (puts API into mock mode).
    """
    key = os.getenv("EXPO_PUBLIC_OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY")
    if not key:
        return None
    return OpenAI(api_key=key)

def chat(
    messages: List[Dict[str, str]],
    max_tokens: int = 400,
    temperature: float = 0.8,
    **kwargs,
) -> str:
    """
    OpenAI chat wrapper with safe mock fallback and nice errors.
    """
    client = get_openai_client()
    if client is None:
        # mock response so UI works without a key
        for m in reversed(messages):
            if m.get("role") == "user" and m.get("content"):
                return "(mock) " + m["content"][:180]
        return "(mock) No content"

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs,
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)[:150]}")

# ------------------ Tarot helpers ------------------

TAROT_DECK = [
    "The Fool", "The Magician", "The High Priestess", "The Empress",
    "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
    "Strength", "The Hermit", "Wheel of Fortune", "Justice",
    "The Hanged Man", "Death", "Temperance", "The Devil",
    "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World",
]

def draw_cards(count: int, seed: Optional[int] = None) -> List[str]:
    rnd = random.Random(seed)
    return rnd.sample(TAROT_DECK, k=min(count, len(TAROT_DECK)))

# ------------------ Schemas ------------------

class PromptRequest(BaseModel):
    mode: str
    biometrics: Dict[str, Any]
    recentEntries: List[Dict[str, Any]]
    intent: str

class InsightRequest(BaseModel):
    text: str
    tags: Dict[str, Any]
    moodBefore: Optional[str] = None
    moodAfter: Optional[str] = None
    foodNotes: Optional[str] = None
    tarotOfDay: Optional[str] = None
    crystalOfDay: Optional[str] = None
    isDream: Optional[bool] = False

class SummarizeRequest(BaseModel):
    entries: List[Dict[str, Any]]

class MeditationRequest(BaseModel):
    entry: Dict[str, Any]

class CommunityPost(BaseModel):
    excerpt: str

class CalendarLink(BaseModel):
    entry: Dict[str, Any]

class TarotDrawRequest(BaseModel):
    spread: str                   # "daily" | "three" | "celtic"
    context: Optional[str] = None
    seed: Optional[int] = None    # optional for deterministic tests

# Conversational Mentor chat
class ChatMessage(BaseModel):
    role: str          # "system" | "user" | "assistant"
    content: str

class MentorChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_state: Optional[Dict[str, Any]] = None

# ------------------ Routes ------------------

@router.post("/api/prompt")
def generate_prompt(req: PromptRequest):
    system = "You are a compassionate journaling guide who writes concise, personalized prompts (~140 chars)."
    user = f"""Mode: {req.mode}
Biometrics: {req.biometrics}
Recent entries (summaries): {req.recentEntries}
Task: {req.intent}"""
    out = chat(
        [{"role": "system", "content": system},
         {"role": "user", "content": user}],
        max_tokens=80, temperature=0.8
    )
    return {"prompt": out}

@router.post("/api/insights/recommend")
def recommend_insights(req: InsightRequest):
    system = "You are an energy coach who suggests body insights, mantras, and crystal recommendations. Be practical, kind, and specific."
    user = f"""Entry text: {req.text}
Tags: {req.tags}
Moods: before={req.moodBefore}, after={req.moodAfter}
Food notes: {req.foodNotes}
Tarot of day: {req.tarrotofDay if hasattr(req, 'tarrotofDay') else req.tarotOfDay}
Crystal of day: {req.crystalOfDay}
Dream mode: {req.isDream}

Return three short lists labeled:
Body Insights:
Mantras:
Crystals:
"""
    out = chat(
        [{"role": "system", "content": system},
         {"role": "user", "content": user}],
        max_tokens=260
    )

    body, mantras, crystals = [], [], []
    current = None
    for line in out.splitlines():
        low = line.lower().strip()
        if "body insights" in low:
            current = "body"; continue
        if "mantras" in low:
            current = "mantra"; continue
        if "crystals" in low:
            current = "crystal"; continue
        if not line.strip():
            continue
        if current == "body":
            body.append(line.strip("-• ").strip())
        elif current == "mantra":
            mantras.append(line.strip("-• ").strip())
        elif current == "crystal":
            crystals.append(line.strip("-• ").strip())

    return {"bodyInsights": body[:5], "mantras": mantras[:5], "crystals": crystals[:5]}

@router.post("/api/mentor/summarize")
def mentor_summarize(req: SummarizeRequest):
    system = "You are a warm mentor. Summarize recurring themes and offer 2 gentle affirmations."
    user = f"Summarize these entries into themes & 2 affirmations: {req.entries}"
    out = chat(
        [{"role": "system", "content": system},
         {"role": "user", "content": user}],
        max_tokens=220
    )
    return {"summary": out}

@router.post("/api/mentor/meditation")
def mentor_meditation(req: MeditationRequest):
    system = "You are a meditation teacher. Create a short practice (2–3 min) tailored to the user's state."
    user = f"Create a short meditation with breath counts & body focus: {req.entry}"
    out = chat(
        [{"role": "system", "content": system},
         {"role": "user", "content": user}],
        max_tokens=220
    )
    return {"meditation": out}

@router.post("/api/community/post")
def post_to_community(req: CommunityPost):
    return {"posted": True, "excerpt": req.excerpt}

@router.post("/api/calendar/link")
def link_calendar(req: CalendarLink):
    return {"linked": True, "entry": req.entry}

@router.post("/api/tarot/draw")
def tarot_draw(req: TarotDrawRequest):
    spread = (req.spread or "daily").lower()
    if spread == "daily":
        cards = draw_cards(1, req.seed); labels = ["Focus"]
    elif spread == "three":
        cards = draw_cards(3, req.seed); labels = ["Past", "Present", "Future"]
    elif spread == "celtic":
        cards = draw_cards(6, req.seed)
        labels = ["Significator", "Crossing", "Crowning", "Root", "Past", "Near Future"]
    else:
        cards = draw_cards(1, req.seed); labels = ["Card"]

    system = "You are an insightful tarot guide. Be grounded, non‑predictive, and empowering."
    user = f"""
Spread: {spread}
Cards: {cards}
Positions: {labels[:len(cards)]}
User context: {req.context or "none"}

For each card: give a short meaning (3–4 lines) tailored to the context.
Then provide:
- Walk Through Your Day: 3 practical, compassionate steps
- Chakra & Crystal Suggestions: up to 3
- Journal Prompt: 1 reflective question
Keep it concise and warm.
"""
    interpretation = chat(
        [{"role": "system", "content": system},
         {"role": "user", "content": user}],
        max_tokens=600, temperature=0.85
    )

    return {
        "spread": spread,
        "cards": [
            {"position": labels[i] if i < len(labels) else f"Card {i+1}", "name": cards[i]}
            for i in range(len(cards))
        ],
        "reading": interpretation,
    }

@router.post("/api/mentor/chat")
def mentor_chat(req: MentorChatRequest):
    """
    Conversational Mentor chat (ChatGPT‑style).
    """
    persona = (
        "You are a warm, present, non-judgmental mentor. "
        "Be specific, practical, and gentle. Offer 1–3 concrete suggestions, "
        "then (optionally) a brief validating line. Ask at most one short follow-up question. "
        "Vary your opening lines—do NOT repeat stock phrases like "
        "'I hear you', 'Let's take a deep breath', 'I understand', or 'I'm here for you'. "
        "Avoid therapy jargon and generic platitudes. Keep replies under ~120 words."
    )

    messages = [{"role": "system", "content": persona}] + [
        {"role": m.role, "content": m.content} for m in req.messages
    ]

    reply = chat(
        messages,
        max_tokens=240,
        temperature=0.95,
        presence_penalty=0.7,
        frequency_penalty=0.3,
    )
    return {"reply": reply}
