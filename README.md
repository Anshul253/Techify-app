# 📊 Excute - Resume Generation Project
 
This project focuses on building a Resume Generation Model integrated with a chatbot interface inspired by ChatGPT. Users interact with the chatbot by answering 10 guided questions to generate a professional resume. The application is built with Next.js and Tailwind CSS for the frontend, and FastAPI for the backend.

---
 
## 🚀 Features
- 📂 **Conversational Resume Builder:** A chatbot interface that interacts with users to collect resume details through 10 questions.
- 🌐 **Frontend Framework:** Built using Next.js for high performance and SEO optimization.
- 🎨 **Styling with Tailwind CSS:** Provides a sleek and responsive design.
- ⚙️ **Backend API:** FastAPI to process user inputs and generate resumes.
- 📱 **Responsive Design:** Optimized for both desktop and mobile views.
- 📄 **Export Option:** Option to download generated resume in preferred formats (Future Work).

---
 
## 📂 Project Structure
```
├── components                # React components (Chatbot UI)
├── pages                     # Next.js pages
├── public                    # Public assets (images, icons, etc.)
├── styles                    # Tailwind CSS styles
├── backend                   # FastAPI backend for resume generation
├── README.md                 # Project documentation (This file)
```
 
---
 
## 🔧 Installation
### Prerequisites
- Node.js 18.0.0 or later
- npm or yarn
 
### Setup
1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/excute.git
cd excute
```
 
2. **Install dependencies:**
```bash
npm install
```
 
3. **Run the development server:**
```bash
npm run dev
```
 
4. **Build for production:**
```bash
npm run build
npm run start
```
 
---
 
## 📌 Chatbot Interaction (Resume Generation)
The Chatbot UI is designed to mimic a conversation where users are prompted with 10 specific questions. The answers are sent to the FastAPI backend for processing and generating a resume.
 
### How to Use
- Access the chatbot interface from the homepage.
- Answer the guided questions.
- Generated resume data is processed by the FastAPI backend.

---

## 🛠️ Technologies Used
- **Frontend:** Next.js, Tailwind CSS, React
- **Backend:** FastAPI
- **Deployment:** Vercel
- **Styling:** Tailwind CSS

---

## 💡 Future Work
- 🌟 Improve UI/UX of the chatbot interface.
- 📄 Implement resume download functionality (PDF, Word, etc.).
- 📊 Enhance the resume generation model for better suggestions.
- 🌐 Deploy a fully integrated solution with FastAPI and Next.js.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
