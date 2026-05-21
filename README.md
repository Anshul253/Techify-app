<div align="center">

# 🚀 Techify

**The ultimate AI-powered career growth and resume building platform.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-2.0-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

</div>

---

## ✨ Overview

**Techify** is a comprehensive, modern platform designed to help job seekers craft the perfect resume and land their dream jobs. By leveraging advanced NLP models and the power of Google's Gemini AI, Techify acts as your personal career assistant—optimizing your resume to beat Applicant Tracking Systems (ATS), generating tailored content, and providing professional templates.

## 🌟 Key Features

### 🤖 AI Conversational Resume Builder
Don't know where to start? Chat with our intelligent Gemini-powered agent. Just describe your experience in natural language, and Techify will automatically generate structured, professional resume sections including a tailored summary, impactful bullet points, and skills.

### 📊 Deep ATS Scanner & Matcher
Upload your existing resume (PDF) alongside a Job Description. Techify performs a multi-dimensional analysis evaluating:
- **Keyword Density & Match Score**
- **Action Verb Usage**
- **Grammar & Readability**
- **Impact Improvements** (with AI-suggested rewrites for your bullet points)

### 🎨 Premium Resume Templates
Preview your generated resume data across beautifully crafted, ATS-optimized templates:
- **Minimal:** Clean, traditional, and strictly professional.
- **Modern:** Sleek typography with a sharp layout.
- **Creative:** Stand out with vibrant accents (perfect for design/frontend roles).
- **Executive:** Authoritative and structured for senior positions.

### 🌗 Seamless Dark & Light Mode
Experience a gorgeous glassmorphic UI that adapts perfectly to your environment with integrated system-theme syncing.

---

## 🛠️ Technology Stack

Techify is built for high performance and scalability using modern web technologies:

* **Frontend:**
  * **Next.js 15** (App Router, Server Components)
  * **React 19**
  * **Tailwind CSS 4.0** (with dark mode support)
  * **Framer Motion** (for smooth micro-animations)
  
* **Backend:**
  * **FastAPI** (High-performance Python API)
  * **Google Gemini 2.0 Flash** (NLP intent engine & text generation)
  * **PyMuPDF / pdfjs** (Resume parsing)
  * **SQLite / aiosqlite** (Database)

* **Authentication:**
  * **Google OAuth 2.0**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- A Google Cloud Console project (for OAuth)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Anshul253/Techify-app.git
cd Techify-app
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Setup environment variables (create .env.local)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id" >> .env.local

# Run the Next.js development server
npm run dev
```
*The frontend will be running at [http://localhost:3000](http://localhost:3000)*

### 3. Backend Setup
```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables (create .env)
echo "GEMINI_API_KEY=your_gemini_api_key" > .env
echo "JWT_SECRET=your_super_secret_jwt_string" >> .env
echo "GOOGLE_CLIENT_ID=your_google_client_id" >> .env

# Run the FastAPI server
uvicorn main:app --reload
```
*The backend API will be running at [http://localhost:8000](http://localhost:8000)*

---

## 📦 Deployment Ready
Techify is fully configured for cloud deployment:
- **Frontend**: One-click deployable to Vercel.
- **Backend**: Pre-configured with a `render.yaml` blueprint for instant deployment on Render.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check out the issues page.

## 📄 License
This project is licensed under the MIT License.
