from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db import get_db, Resume
import os
from pydantic import BaseModel
from typing import Optional, List
import json

router = APIRouter()

from google import genai as google_genai
from google.genai import types as genai_types


# ─── Pydantic Models ─────────────────────────────────────────────────────────

class ResumeRewriteRequest(BaseModel):
    section_text: str
    role: str


class ResumeCreate(BaseModel):
    title: str
    data_json: dict
    user_id: Optional[int] = None
    ats_score: Optional[float] = None


class NLPBuildRequest(BaseModel):
    conversation_history: List[dict]
    user_prompt: str
    target_role: Optional[str] = None


# ─── Helper ──────────────────────────────────────────────────────────────────

def _get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    return google_genai.Client(api_key=api_key)


def _strip_markdown(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1] if len(parts) > 1 else raw
        if raw.startswith("json"):
            raw = raw[4:]
    return raw.strip()


# ─── POST /api/resume/rewrite ─────────────────────────────────────────────────

@router.post("/rewrite")
async def rewrite_section(payload: ResumeRewriteRequest):
    client = _get_gemini_client()

    prompt = f"""You are an expert career coach. Rewrite this resume text for the role: {payload.role}
Use strong action verbs, quantify achievements, make it ATS-optimized.
Output ONLY this JSON (no markdown):
{{"rewritten_text": "The fully rewritten text here."}}

ORIGINAL TEXT:
{payload.section_text}"""

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=genai_types.GenerateContentConfig(thinking_config=genai_types.ThinkingConfig(thinking_budget=0))
        )
        data = json.loads(_strip_markdown(response.text))
        return {"rewritten_text": data.get("rewritten_text", "")}
    except Exception as e:
        print("Rewrite error:", e)
        raise HTTPException(status_code=500, detail="Failed to rewrite section.")


# ─── POST /api/resume/nlp-build ───────────────────────────────────────────────

@router.post("/nlp-build")
async def nlp_build_resume(payload: NLPBuildRequest):
    client = _get_gemini_client()

    # Build compact conversation context
    history_text = ""
    for msg in payload.conversation_history[-8:]:
        role_label = "User" if msg.get("role") == "user" else "AI"
        history_text += f"{role_label}: {msg.get('content', '')}\n"

    prompt = f"""You are TechifyAI, an expert resume builder AI. Extract ALL resume information from the conversation and generate a COMPLETE resume immediately.

CONVERSATION:
{history_text}
User: {payload.user_prompt}

    RULES:
    - Extract EVERYTHING the user mentioned (name, email, phone, location, LinkedIn, GitHub, skills, experience, education, projects, certifications)
    - Identify what core fields are missing. The core fields are: Name, Email, Target Role, Experience, Skills, and Education.
    - If ANY core field is missing, set intent="gathering_info" and ask ONE friendly follow-up question to get that specific missing info.
    - Do NOT generate fake or placeholder experience/education if it's missing. Just ask the user for it.
    - Set intent="ready_to_generate" ONLY when you have collected all core fields.
    - When generating, rewrite and rephrase weak achievement bullets into strong, quantified, action-verb-led statements (e.g., 'did sales' -> 'Increased regional sales revenue by 32% YoY through strategic client outreach').
    - Write a compelling 2-3 sentence professional summary with target role keywords
    - Infer soft skills from context and technical skills from job titles/projects
    - Keep replies conversational, warm, and brief (1-2 sentences max)
    - IMPORTANT: Your reply MUST be response-ready. DO NOT use ANY filler phrases like 'Great!', 'Sure!', 'Of course!', 'Got it!', 'I can help with that'. Start your response immediately with the purposeful question or statement. Every message must move the conversation forward.

Output ONLY raw JSON (no markdown fences, no explanation):
{{
    "reply": "<brief friendly message, max 2 sentences>",
    "intent": "<'ready_to_generate' | 'gathering_info'>",
    "missing_fields": ["<only truly missing critical fields>"],
    "extracted_data": {{
        "personal": {{
            "name": "<full name or 'Professional Candidate' if unknown>",
            "email": "<email or null>",
            "phone": "<phone or null>",
            "location": "<City, Country or null>",
            "linkedin": "<linkedin URL or null>",
            "github": "<github URL or null>"
        }},
        "target_role": "<detected or inferred target role>",
        "summary": "<2-3 sentence ATS-optimized professional summary using target role keywords>",
        "skills": {{
            "technical": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
            "soft": ["<soft1>", "<soft2>", "<soft3>"]
        }},
        "experience": [
            {{
                "title": "<job title>",
                "company": "<company name>",
                "location": "<city or Remote>",
                "startDate": "<Month Year>",
                "endDate": "<Month Year or Present>",
                "bullets": [
                    "<Action verb + task + quantified result e.g. 'Engineered a scalable REST API serving 500K daily requests, reducing response time by 35%'>",
                    "<Action verb + task + impact>",
                    "<Action verb + achievement>"
                ]
            }}
        ],
        "education": [
            {{
                "degree": "<degree name>",
                "institution": "<institution name>",
                "year": "<graduation year>",
                "gpa": "<GPA or null>"
            }}
        ],
        "certifications": ["<cert1>", "<cert2>"],
        "projects": [
            {{
                "name": "<project name>",
                "description": "<one strong sentence describing impact>",
                "tech": ["<tech1>", "<tech2>"],
                "url": "<url or null>"
            }}
        ]
    }},
    "ats_score": <integer 0-100>
}}"""

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=genai_types.GenerateContentConfig(
                thinking_config=genai_types.ThinkingConfig(thinking_budget=0)
            )
        )
        raw = _strip_markdown(response.text)
        data = json.loads(raw)
        return data
    except json.JSONDecodeError as e:
        print("NLP Build JSON parse error:", e)
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")
    except Exception as e:
        print("NLP Build error:", e)
        raise HTTPException(status_code=500, detail=str(e))


from routes.auth import get_current_user

# ─── POST /api/resume/ — Save Resume ─────────────────────────────────────────

@router.post("/")
async def create_resume(resume_data: ResumeCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    db_resume = Resume(
        title=resume_data.title,
        data_json=resume_data.data_json,
        user_id=current_user.id,
        ats_score=resume_data.ats_score
    )
    db.add(db_resume)
    await db.commit()
    await db.refresh(db_resume)
    return db_resume


# ─── GET /api/resume/history ──────────────────────────────────────────────────

@router.get("/history")
async def get_my_resumes(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()))
    resumes = result.scalars().all()
    return resumes
