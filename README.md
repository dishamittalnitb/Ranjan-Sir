# Ranjan Sir

Ranjan Sir is an AI-powered academic execution mentor for CBSE Class 10 students. The repo combines a React frontend with a Python FastAPI backend to provide a guided study-planning experience, subject prioritization, and student-specific academic coaching grounded in the project wiki and student knowledge state.

The system is designed around a simple idea: rather than teaching everything from scratch, it helps the student focus on the right task today, protect cognitive capacity, prioritize weak concepts, and follow a board-exam-aligned execution path without burnout.

## Why this project exists

This repo turns the product vision from the PRD into a working prototype:

- Guided academic triage and daily planning
- Student-specific context from a local student OS
- Knowledge grounding from a structured wiki of syllabus chapters and resources
- Mentor-style responses with a clear academic coaching persona
- A frontend that mirrors the execution flow for tasks like flow triage, profile views, and assessment tracking

## Product overview

This project has two main layers:

1. Frontend UI
   - React + Vite + TypeScript
   - Main user experience for dashboards, planning flow, and profile screens

2. Backend API
   - FastAPI service
   - Retrieval from the local wiki and student OS
   - Mentor answer generation with optional Gemini API support
   - Flow-engine logic for guided learning actions

## Repository structure

```text
RanjanSir/
├── AGENTS.md                # Implementation rules and repo conventions
├── ARCHITECTURE.md          # High-level engineering plan
├── PRD.md                   # Product requirements and UX specification
├── README.md                # Project overview and setup guide
├── Backend/
│   ├── main.py              # FastAPI app entrypoint
│   ├── engine.py            # Retrieval + mentor answer orchestration
│   ├── flow.py              # Guided flow state and action logic
│   ├── schemas.py           # Pydantic request/response models
│   ├── requirements.txt     # Python dependencies
│   ├── PROMPTS/
│   │   ├── initialKb.md
│   │   ├── ranjanSir.md
│   │   └── ranjanSir_OLD.md
│   ├── School_Master_Wiki/
│   │   ├── 01_Raw_Sources/
│   │   ├── 02_Syllabus_Graph/
│   │   ├── 03_Resource_Index/
│   │   └── ...
│   └── Student_OS_Arjun_Class10/
│       ├── student_index.md
│       ├── execution_log.md
│       ├── MENTOR_INSTRUCTIONS.md
│       └── ...
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── components/
│       ├── data/
│       ├── flow/
│       ├── lib/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── index.css
│       └── main.tsx
└── context.md
```

## Core technology stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS

### Backend
- Python 3.11+
- FastAPI
- Pydantic v2
- Google GenAI SDK (optional, for Gemini-backed answers)

### Knowledge model
- Local markdown-based academic wiki under `Backend/School_Master_Wiki/`
- Student-specific state under `Backend/Student_OS_Arjun_Class10/`
- Retrieval-based grounding before answering

## How the backend works

The backend is centered on `Backend/main.py` and `Backend/engine.py`.

### API endpoints

```text
GET  /health
GET  /api/student
POST /api/answer
POST /api/flow/action
```

### Behavior

- `/api/student` loads the current student profile from the student OS metadata
- `/api/answer` queries the wiki using keyword-based retrieval and returns a grounded mentor-style answer
- `/api/flow/action` handles guided flow transitions and task progression

The backend is intentionally designed to avoid fabricating academic content: it uses the repo's wiki and student records as the primary source of truth.

## How the frontend works

The frontend is a Vite app with a main shell and route-based screens.

Current route structure:

- `/` → guided flow screen
- `/profile` → profile screen

This app is a prototype of the product experience described in `PRD.md`, which contains the user journeys, functional requirements, and product design notes.

## Setup and run

### 1. Clone the repo

```bash
git clone <repo-url>
cd RanjanSir
```

### 2. Install backend dependencies

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment variables (optional)

Create a `.env` file inside `Backend/` if you want Gemini-backed answer generation:

```env
GOOGLE_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.8-flash
```

If no key is present, the app falls back to deterministic knowledge retrieval from the local wiki.

### 4. Run the backend

```bash
cd Backend
uvicorn main:app --reload --port 8000
```

The API should be available at:

- http://localhost:8000
- http://localhost:8000/health

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

### 6. Run the frontend

```bash
npm run dev
```

The Vite app usually runs at:

- http://localhost:5173

## Important project documentation

For deeper context, read these files:

- `PRD.md` — product vision and UX requirements
- `ARCHITECTURE.md` — engineering plan and architecture options
- `AGENTS.md` — non-negotiable implementation rules for contributors
- `Backend/PROMPTS/ranjanSir.md` — mentor persona prompt and behavior guidelines

## Development notes

- The project is a prototype and not yet a full production SaaS stack.
- Academic content is intentionally grounded in the local wiki rather than invented by the model.
- The repo is oriented around a coaching/personalized study flow, not a generic chat application.
- The project uses local markdown resources as the canonical knowledge graph for classroom and subject details.

## Contribution guidance

When contributing:

- Keep academic content aligned with the repo's wiki sources
- Do not modify raw source data in `Backend/School_Master_Wiki/01_Raw_Sources/`
- Keep changes scoped to the request
- Follow the conventions described in `AGENTS.md`

## License

This project does not currently include a license file. If you plan to share it publicly, add an appropriate license before distribution.

## Summary

Ranjan Sir is a focused academic mentorship and planning system that combines a student-aware AI mentor, local subject knowledge, and a guided execution workflow. It is best understood as a subject-aware execution coach that helps students protect focus, reduce overload, and work through board-exam priorities with discipline.
