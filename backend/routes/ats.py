from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
import re
import io
import json
import os
import math
from utils.pdf_extractor import extract_text_from_pdf
from google import genai as google_genai
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db, Resume
from routes.auth import get_current_user

router = APIRouter()

# ─── Role keyword dictionary (expanded) ───────────────────────────────────────
role_keywords = {
    "Software Engineer":    ["Python", "Java", "C++", "React", "Node.js", "Docker", "Algorithms",
                             "Data Structures", "Git", "Agile", "SQL", "NoSQL", "CI/CD", "REST API",
                             "TypeScript", "Kubernetes", "Microservices", "TDD", "System Design"],
    "Data Scientist":       ["Python", "R", "SQL", "Machine Learning", "Deep Learning", "TensorFlow",
                             "PyTorch", "Pandas", "Scikit-Learn", "Data Visualization", "Statistics",
                             "NLP", "Feature Engineering", "A/B Testing", "Jupyter", "Spark"],
    "Product Manager":      ["Agile", "Scrum", "Roadmap", "Product Strategy", "User Research",
                             "A/B Testing", "Jira", "Go-to-Market", "Stakeholder Management", "KPIs",
                             "OKRs", "Prioritization", "User Stories", "Product Analytics"],
    "UX Designer":          ["Figma", "Sketch", "Adobe XD", "Wireframing", "Prototyping",
                             "User Research", "Usability Testing", "Interaction Design", "HTML", "CSS",
                             "Design Systems", "Accessibility", "User Journey", "Information Architecture"],
    "DevOps Engineer":      ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Jenkins", "Terraform",
                             "Ansible", "Linux", "Bash", "CI/CD", "Monitoring", "Networking",
                             "Helm", "Prometheus", "Grafana", "Infrastructure as Code"],
    "Frontend Developer":   ["React", "Vue", "Angular", "TypeScript", "JavaScript", "CSS", "HTML",
                             "Webpack", "Redux", "GraphQL", "Responsive Design", "Jest",
                             "Next.js", "Tailwind", "Performance Optimization", "Web Accessibility"],
    "Backend Developer":    ["Python", "Java", "Node.js", "Django", "FastAPI", "Spring Boot",
                             "PostgreSQL", "MongoDB", "REST API", "Microservices", "Docker",
                             "Redis", "Message Queue", "Authentication", "Authorization"],
    "Full Stack Developer": ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "REST API",
                             "Docker", "Git", "AWS", "CI/CD", "MongoDB", "Next.js", "GraphQL"],
    "Data Engineer":        ["Python", "Spark", "Kafka", "Airflow", "SQL", "ETL", "Data Pipeline",
                             "AWS", "GCP", "Snowflake", "dbt", "BigQuery", "Hadoop"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "MLOps", "Docker", "Kubernetes",
                                  "Feature Engineering", "Model Deployment", "REST API", "SQL",
                                  "Scikit-Learn", "A/B Testing", "Model Monitoring"],
    "Marketing":            ["SEO", "SEM", "Content Strategy", "Digital Marketing", "Social Media",
                             "Google Analytics", "CRM", "Email Marketing", "Copywriting",
                             "Brand Strategy", "Campaign Management", "PPC"],
    "Finance":              ["Financial Modeling", "Excel", "Accounting", "Forecasting",
                             "Valuation", "Financial Analysis", "ERP", "Auditing", "Budgeting",
                             "DCF", "Bloomberg", "SQL", "Power BI"],
    "HR":                   ["Recruitment", "Talent Acquisition", "Employee Relations", "Onboarding",
                             "Performance Management", "HRIS", "Compliance", "Training",
                             "Compensation", "Diversity & Inclusion"],
    "Project Manager":      ["Agile", "Scrum", "PMP", "Risk Management", "Stakeholder Management",
                             "Jira", "MS Project", "Budget Management", "Resource Planning",
                             "Change Management", "Waterfall"],
    "Cybersecurity":        ["Penetration Testing", "SIEM", "Incident Response", "Vulnerability Assessment",
                             "Firewall", "Network Security", "CompTIA Security+", "CISSP",
                             "Python", "Linux", "SOC", "Threat Intelligence"],
}


def detect_role(text: str) -> str:
    text_lower = text.lower()
    best_role, max_matches = "Software Engineer", -1
    for role, keywords in role_keywords.items():
        matches = sum(1 for kw in keywords if kw.lower() in text_lower)
        if matches > max_matches:
            max_matches = matches
            best_role = role
    return best_role


def check_grammar(text: str) -> dict:
    """Grammar check with language_tool_python, graceful fallback."""
    try:
        import language_tool_python
        tool = language_tool_python.LanguageTool("en-US")
        tool.disable_spellchecking()
        matches = tool.check(text)
        num_errors = len(matches)
        mistake_score = max(30, 100 - num_errors * 2)
        return {"mistake_score": mistake_score, "error_count": num_errors}
    except Exception:
        return {"mistake_score": 75, "error_count": 0}


def calculate_readability(text: str) -> float:
    """Flesch Reading Ease score (higher = more readable, aim for 60-80 for resumes)."""
    sentences = max(1, len(re.findall(r'[.!?]+', text)))
    words = text.split()
    word_count = max(1, len(words))
    syllables = sum(max(1, len(re.findall(r'[aeiouAEIOU]', w))) for w in words)
    score = 206.835 - 1.015 * (word_count / sentences) - 84.6 * (syllables / word_count)
    return round(max(0, min(100, score)), 1)


def count_quantified_bullets(text: str) -> int:
    """Count bullet points that contain numbers/metrics (quantified achievements)."""
    bullets = re.findall(r'[•\-–]\s*.+', text)
    quantified = [b for b in bullets if re.search(r'\d+[%x$kKmMbB+]?|\d+\s*(percent|x|times|million|billion)', b, re.IGNORECASE)]
    return len(quantified), len(bullets)


def check_ats_formatting(text: str) -> dict:
    """Detect common ATS-unfriendly patterns."""
    issues = []
    # Check for missing key sections
    if not re.search(r'\b(summary|objective|profile)\b', text, re.IGNORECASE):
        issues.append("Missing Professional Summary section")
    if not re.search(r'\b(experience|employment|work history)\b', text, re.IGNORECASE):
        issues.append("Missing Work Experience section")
    if not re.search(r'\b(skills|competencies|expertise)\b', text, re.IGNORECASE):
        issues.append("Missing Skills section")
    if not re.search(r'\b(education|degree|university|college)\b', text, re.IGNORECASE):
        issues.append("Missing Education section")

    # Check for good formatting signals
    has_email = bool(re.search(r'\b[\w.+-]+@[\w-]+\.\w+\b', text))
    has_phone = bool(re.search(r'\b[\+\d][\d\s\-().]{7,}\d\b', text))
    has_linkedin = bool(re.search(r'linkedin\.com', text, re.IGNORECASE))

    contact_score = sum([has_email, has_phone, has_linkedin]) * 33
    formatting_score = max(0, 100 - len(issues) * 25)

    return {
        "formatting_score": formatting_score,
        "contact_score": contact_score,
        "has_email": has_email,
        "has_phone": has_phone,
        "has_linkedin": has_linkedin,
        "formatting_issues": issues,
    }


def calculate_resume_score(text: str) -> dict:
    """Comprehensive ATS resume score across 7 dimensions based on SRS."""
    detected_role = detect_role(text)
    keywords = role_keywords.get(detected_role, [])

    # 1. Keyword Optimization (25%)
    keyword_count = sum(1 for k in keywords if k.lower() in text.lower())
    keyword_score = round(min(25, (keyword_count / max(len(keywords), 1)) * 25))

    # 2. Formatting & Parseability (20%)
    fmt = check_ats_formatting(text)
    formatting_score = round(min(20, (fmt["formatting_score"] / 100) * 20))

    # 3. Contact Information (10%)
    contact_score = round(min(10, (fmt["contact_score"] / 100) * 10))

    # 4. Work Experience Quality (20%)
    q_count, total_bullets = count_quantified_bullets(text)
    action_verbs = ["managed", "led", "developed", "created", "designed", "built", "improved", "increased", "reduced", "spearheaded", "engineered", "implemented", "delivered", "architected"]
    action_count = len([b for b in re.findall(r'[•\-–]\s*(\w+)', text) if b.lower() in action_verbs])
    
    we_score = 0
    if total_bullets > 0:
        we_score += 10 * min(1, q_count / max(total_bullets * 0.3, 1)) # 30% quantified gets 10 pts
        we_score += 10 * min(1, action_count / max(total_bullets * 0.5, 1)) # 50% action verbs gets 10 pts
    we_score = round(min(20, we_score))

    # 5. Education Section (10%)
    has_edu = bool(re.search(r'\b(education|degree|university|college|academic)\b', text, re.IGNORECASE))
    has_degree = bool(re.search(r'\b(bachelor|master|phd|b\.?s\.?|m\.?s\.|b\.?a\.)\b', text, re.IGNORECASE))
    education_score = 10 if (has_edu and has_degree) else (5 if has_edu else 0)

    # 6. Skills Section (10%)
    has_skills = bool(re.search(r'\b(skills|competencies|expertise|technologies)\b', text, re.IGNORECASE))
    skills_score = 10 if has_skills else 0

    # 7. Section Completeness (5%)
    sections = {
        "Summary":         re.search(r'\b(summary|objective|profile|about me)\b', text, re.IGNORECASE),
        "Experience":      re.search(r'\b(experience|employment|work history|professional)\b', text, re.IGNORECASE),
        "Skills":          has_skills,
        "Education":       has_edu,
    }
    section_score = round(sum(1 for s in sections.values() if s) / len(sections) * 5)

    total = keyword_score + formatting_score + contact_score + we_score + education_score + skills_score + section_score

    return {
        "resume_score":       total,
        "keyword_score":      keyword_score,
        "formatting_score":   formatting_score,
        "contact_score":      contact_score,
        "work_experience_score": we_score,
        "education_score":    education_score,
        "skills_score":       skills_score,
        "section_score":      section_score,
        "detected_role":      detected_role,
        "keyword_count":      keyword_count,
        "total_keywords":     len(keywords),
        "formatting_details": fmt,
    }


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


# ─── POST /api/ats/ — Quick Resume Score ─────────────────────────────────────
@router.post("/")
async def get_ats_score(
    file: UploadFile = File(...), 
    db: AsyncSession = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    contents = await file.read()
    pdf_text = extract_text_from_pdf(io.BytesIO(contents))

    if not pdf_text or len(pdf_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Could not extract readable text from the PDF. Ensure it is not image-only or password-protected.")

    grammar_result = check_grammar(pdf_text)
    resume_result = calculate_resume_score(pdf_text)

    # Save to database
    db_resume = Resume(
        title=f"ATS Scan: {file.filename}",
        data_json={"grammar": grammar_result, "resume": resume_result, "raw_text": pdf_text[:500]}, # Store limited text for size
        user_id=current_user.id,
        ats_score=resume_result.get("resume_score", 0)
    )
    db.add(db_resume)
    await db.commit()

    return {
        "grammar": grammar_result,
        "resume": resume_result,
        "id": db_resume.id
    }


# ─── POST /api/ats/jd-match — JD Match (Gemini) ──────────────────────────────
@router.post("/jd-match")
async def jd_match(file: UploadFile = File(...), job_description: str = Form(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    contents = await file.read()
    resume_text = extract_text_from_pdf(io.BytesIO(contents))

    if not resume_text or len(resume_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Could not extract readable text from the PDF.")

    client = _get_gemini_client()

    prompt = f"""You are an expert ATS algorithm and career coach.
Compare the Resume against the Job Description below.

Output ONLY valid JSON — no markdown, no preamble, no explanation:
{{
    "overall_match_score": <integer 0-100>,
    "matched_keywords":    ["keyword1", "keyword2"],
    "missing_keywords":    ["keyword3", "keyword4"],
    "section_scores":      {{"skills": <int>, "experience": <int>, "education": <int>}},
    "recommendations":     ["specific actionable suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]
}}

--- RESUME ---
{resume_text[:4000]}

--- JOB DESCRIPTION ---
{job_description[:3000]}
"""

    try:
        response = client.models.generate_content(model="gemini-flash-latest", contents=prompt)
        data = json.loads(_strip_markdown(response.text))
        return data
    except json.JSONDecodeError as e:
        print("ATS JD-match JSON error:", e)
        raise HTTPException(status_code=500, detail="Gemini returned invalid JSON. Please try again.")
    except Exception as e:
        print("ATS JD-match error:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ─── POST /api/ats/full-scan — Deep AI Analysis ───────────────────────────────
@router.post("/full-scan")
async def full_scan(
    file: UploadFile = File(...), 
    job_description: str = Form(""),
    db: AsyncSession = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    """
    Full deep ATS analysis combining rule-based scoring AND Gemini AI insights.
    Returns 7-dimension scores + AI recommendations + optimized summary suggestion.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    contents = await file.read()
    resume_text = extract_text_from_pdf(io.BytesIO(contents))

    if not resume_text or len(resume_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Could not extract readable text. Ensure the PDF is not image-only or password-protected.")

    # Rule-based scores
    grammar_result = check_grammar(resume_text)
    resume_result = calculate_resume_score(resume_text)
    fmt = resume_result.get("formatting_details", {})

    client = _get_gemini_client()

    jd_section = f"\n--- JOB DESCRIPTION ---\n{job_description[:3000]}" if job_description.strip() else ""

    ai_prompt = f"""You are the world's best ATS expert and career coach. Perform a comprehensive resume analysis.

--- RESUME ---
{resume_text[:5000]}
{jd_section}

Provide a detailed analysis. Output ONLY valid JSON:
{{
    "ai_ats_score": <integer 0-100, your overall ATS score>,
    "role_detected": "<the most likely target role>",
    "professional_summary_rewrite": "<Write a powerful 3-sentence ATS-optimized professional summary for this person. Use keywords from their background.>",
    "top_strengths": [
        "<strength 1 — be specific, reference actual content>",
        "<strength 2>",
        "<strength 3>"
    ],
    "top_improvements": [
        {{
            "issue": "<specific problem found>",
            "impact": "<high|medium|low>",
            "fix": "<exact actionable fix with example>"
        }},
        {{
            "issue": "<specific problem 2>",
            "impact": "<high|medium|low>",
            "fix": "<exact actionable fix>"
        }}
    ],
    "matched_keywords": ["<keyword found in resume>"],
    "missing_keywords": ["<important keyword missing from resume>"],
    "keyword_density_feedback": "<1-2 sentences on keyword usage>",
    "bullet_quality_feedback": "<1-2 sentences on bullet point quality>",
    "job_match_score": <integer 0-100 if JD provided, else null>
}}
"""

    try:
        response = client.models.generate_content(model="gemini-flash-latest", contents=ai_prompt)
        ai_data = json.loads(_strip_markdown(response.text))
    except Exception as e:
        print("Full scan AI error:", e)
        # If AI fails, return rule-based only
        ai_data = {
            "ai_ats_score": resume_result["resume_score"],
            "role_detected": resume_result["detected_role"],
            "professional_summary_rewrite": None,
            "top_strengths": [],
            "top_improvements": [],
            "matched_keywords": [],
            "missing_keywords": [],
            "keyword_density_feedback": "",
            "bullet_quality_feedback": "",
            "job_match_score": None,
        }

    # Weighted final score: 60% AI + 40% rule-based
    final_score = round(
        0.6 * (ai_data.get("ai_ats_score") or resume_result["resume_score"]) +
        0.4 * resume_result["resume_score"]
    )

    final_result = {
        "final_ats_score": final_score,
        "rule_based": resume_result,
        "grammar": grammar_result,
        "ai_analysis": ai_data,
        "formatting": fmt,
    }

    # Save to database
    db_resume = Resume(
        title=f"Full ATS Scan: {file.filename}",
        data_json=final_result,
        user_id=current_user.id,
        ats_score=final_score
    )
    db.add(db_resume)
    await db.commit()

    return final_result
