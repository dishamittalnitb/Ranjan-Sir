# Context — Ranjan Sir Academic Strategist

AI execution mentor for a CBSE Class 10 student. The product turns "what should I do today?" into a
bounded, board-exam-aligned execution plan (triage → capacity → subject priority → prerequisite bridge → quest).

Reference docs: **`PRD.md`** (product spec + data models + full API contract), Stitch project
`projects/16137700896185762344` (design source of truth).

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | **React 18 + TypeScript + Tailwind CSS + Vite + React Router** |
| Design system | "Executive Academic Strategy" (Stitch) — tokens in `frontend/tailwind.config.js` |
| Icons / fonts | Material Symbols Outlined; Inter, Newsreader, Instrument Serif, Space Mono |
| Backend (knowledge) | Markdown "wiki" + per-student Markdown OS + Python ingestion scripts |
| Backend (API) | FastAPI `Backend/main.py` — `/api/answer` (port 8000, CORS for 5173); full REST `/api/v1` per PRD.md §6 |
| Mentor logic | Gemini (`google-genai`) via RAG — wiki chapters + student OS + `ranjanSir.md` persona; deterministic fallback when no `GOOGLE_API_KEY` |

> `frontend/src` is **TypeScript** (`.tsx` / `.ts`). All new code must be TS.

## Folder Structure

```
RanjanSir/
├── PRD.md
├── context.md
├── AGENTS.md
├── .vscode/mcp.json              # Stitch MCP server config
├── frontend/                     # React + Tailwind SPA
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js        # design tokens (surface-*, on-*, primary, outline-*)
│   ├── postcss.config.js
│   └── src/
│       ├── main.tsx / App.tsx    # entry + router (BrowserRouter)
│       ├── index.css             # Tailwind + font/scrollbar utilities
│       ├── components/           # dumb Stitch UI blocks (Button, Icon, MetricCard, …)
│       ├── flow/                 # dynamic renderer: registry.tsx, DynamicRenderer.tsx, useFlow.ts
│       ├── pages/                # FlowScreen (dynamic) + ProfileScreen
│       ├── services/api.ts       # typed API client (submitQuery, fetchStudent, sendFlowAction)
│       ├── data/mockData.ts      # typed mock data (profile fallback)
│       ├── types/models.ts       # shared domain models (PRD §5)
│       └── lib/cx.ts             # classnames helper
└── Backend/                      # knowledge + ingestion (no web server)
    ├── PROMPTS/                  # ranjanSir.md (mentor prompt), initialKb.md
    ├── School_Master_Wiki/       # SOURCE OF TRUTH for all academic content
    │   ├── 01_Raw_Sources/       # IMMUTABLE: CBSE directives, NCERT, PYQs (2022–25)
    │   ├── 02_Syllabus_Graph/    # 162 chapter pages: SCI/MATH/ENG/SST_ChNN
    │   ├── 03_Resource_Index/    # cbse_index.md, pyq_index.md
    │   ├── _cbse_schema.md
    │   └── log.md                # append-only ops log
    ├── Student_OS_Aditi_Class10/ # per-student state
    │   ├── 01_Knowledge_State/   # Weak_Concepts.md
    │   ├── 02_Assessment_Analytics/ # Presentation_&_Step_Errors.md
    │   ├── 03_Execution_Plans/
    │   ├── 04_Behavioral_Profile/
    │   ├── execution_log.md      # append-only
    │   ├── student_index.md
    │   └── MENTOR_INSTRUCTIONS.md
    ├── main.py                   # thin FastAPI HTTP layer (routes + CORS)
    ├── schemas.py                # Pydantic contracts (Answer*, StudentProfile, UIComponentSchema, FlowStepResponse, FlowActionRequest)
    ├── engine.py                 # answering engine (retrieval + student OS + Gemini, deterministic fallback)
    ├── flow.py                   # backend-driven UI flow state machine (renders FlowStepResponse)
    ├── requirements.txt          # fastapi, uvicorn, pydantic, PyYAML, google-genai
    ├── cbse.py                   # bootstrap: folders + CBSE syllabus PDFs + NCERT
    ├── pyq.py                    # download CBSE PYQ zips (2022–25)
    └── fix.py                    # flatten zips + PDF→Markdown (PyMuPDF4LLM)
```

## Component Map (frontend/src/components)

- **Primitives:** `Icon`, `Button`, `StatusChip`, `ProgressBar`, `MetricCard`, `Monogram`
- **Layout:** `AppSidebar`, `TopBar`, `DoubtDesk`, `ChatComposer`, `ChatStarters`
- **Feature:** `SubjectSelector`, `QuestTimeline`, `CalendarGrid`, `MilestoneBadge`,
  `GuidedStepCard`, `CoachingLoadPreview`

## API Contract (summary — full spec in PRD.md §6)

Base `/api/v1`, bearer auth, JSON. Server is authoritative for curfew/cognitive-cap/quest-unlock rules.

- `/students/{id}` (+ `/preferences`, `/profile`, `/avatar`) — identity & profile
- `/chat`, `/chat/{conversationId}` — mentor conversation
- `/triages`, `/triages/{sessionId}` (+ `/steps/{step}/advance`, `/subject`, `/doubt-desk`) — guided flow
- `/quests/active`, `/quests/{id}/stages/{stage}/…`, `/quests/{id}/reroute` — adaptive quest
- `/diagnostics`, `/sprints/{id}/…` — correction sprints
- `/questions/{id}` (+ `/attempt`, `/derivation`, `/method-review`, `/next`) — practice & verification
- `/sessions`, `/day-wrap/{date}` (+ `/conclude`, `/export`) — focus blocks & load balancing
- `/students/{id}/performance`, `/students/{id}/milestones` — analytics & badges

Data models (Student, Preferences, Subject, ChatMessage, GuidedFlowSession, Quest/QuestStage,
Question/Attempt, StudySession, DayPlan, PerformanceLog, Milestone) — see **PRD.md §5**.

---

## Change Log

Append-only. Read this file before a change; append a dated entry after each change.

- **2026-09-28 — Backend API + frontend TypeScript bridge**
  - Added `Backend/main.py` (FastAPI): `AnswerRequest`/`AnswerResponse`, `POST /api/answer` (deterministic
    retrieval over `School_Master_Wiki/02_Syllabus_Graph`), `GET /health`, CORS for `http://localhost:5173`,
    runs on port 8000. Added `Backend/requirements.txt` (fastapi, uvicorn, pydantic) + `.venv`.
  - Migrated `frontend/src` from `.jsx`/`.js` to TypeScript (`.tsx`/`.ts`): added `@types/react`,
    `@types/react-dom`, `typescript`; updated `tsconfig.json` (strict, `jsx: react-jsx`,
    `verbatimModuleSyntax`); `build` now runs `tsc --noEmit && vite build`.
  - Added `frontend/src/services/api.ts` (`submitQuery` → `POST http://localhost:8000/api/answer`).
  - Added `frontend/src/types/models.ts` (shared domain models).
  - Updated `HomeScreen` to bind `query`/`loading`/`error`/`messages` and render `AnswerResponse.answer`
    (+ `sources`) with loading indicator and error alert.
  - Verified: `npx tsc --noEmit` clean; `npm run build` passes; `/api/answer` smoke-tested (200).

- **2026-09-28 — Student OS (Arjun) + backend-served profile**
  - Created `Backend/Student_OS_Arjun_Class10/` mirroring Aditi's structure: `student_index.md`
    (YAML frontmatter profile), `MENTOR_INSTRUCTIONS.md`, `execution_log.md`,
    `01_Knowledge_State/Weak_Concepts.md`, `02_Assessment_Analytics/Presentation_&_Step_Errors.md`,
    `03_Execution_Plans/2026-09-28_Plan.md`, `04_Behavioral_Profile/Psychology_State.md`.
  - `Backend/main.py`: added `GET /api/student` (parses `student_index.md` frontmatter → `StudentProfile`),
    and `/api/answer` now personalizes from Arjun's `Weak_Concepts.md` (matched via query tokens +
    source chapter). Added `PyYAML` to `requirements.txt`. Tokenizer now drops 1-char tokens.
  - `frontend/src/services/api.ts`: added `fetchStudent()` (→ `GET /api/student`).
  - `frontend/src/pages/ProfileScreen.tsx`: loads student from backend on mount (mock as fallback).
  - Verified: `/api/student` returns Arjun profile; `/api/answer` personalizes ("Heads-up: … flagged
    weakness"); `npx tsc --noEmit` clean; `npm run build` passes.

- **2026-09-28 — Gemini-powered mentor (RAG over wiki + student OS)**
  - `Backend/main.py` now calls Gemini via `google-genai` when `GOOGLE_API_KEY` is set. It builds RAG
    context from retrieved `02_Syllabus_Graph` chapters + `Weak_Concepts.md` + student profile, and uses
    `PROMPTS/ranjanSir.md` (trimmed of the stale trailing "ask") as the system instruction. Falls back to
    the deterministic retrieval when the key is absent or the call fails.
  - Added `GOOGLE_API_KEY` / `GEMINI_MODEL` env vars (`.env` auto-loaded from `Backend/.env`; added
    `Backend/.env.example`). `GET /health` now reports `{status, gemini, model}`.
  - `requirements.txt` + `google-genai>=1.0.0`.
  - Verified: no-key → deterministic fallback; fake key → graceful `None` (auth error caught) → fallback;
    mentor prompt tail stripped; `/health` flag correct.

- **2026-09-28 — Gemini key configured + model updated**
  - Configured `GOOGLE_API_KEY` in `Backend/.env` (gitignored via `Backend/.gitignore`) — key verified
    live against Gemini. Changed default model to `gemini-3.8-flash` (`gemini-2.0-flash` is deprecated)
    in `main.py`, `.env`, and `.env.example`.
  - Verified: `/api/answer` returns a real Gemini answer — personalized ("Arjun, open your notes to
    `SCI_Ch25_Electricity.md`…") with board-exam step-marking guidance from the wiki + student context.

- **2026-09-28 — Backend-driven dynamic flow (JSON-schema UI)**
  - Split the backend into `schemas.py` (Pydantic contracts), `engine.py` (answering engine: retrieval +
    student OS + Gemini with deterministic fallback), `flow.py` (state machine: `initial_prompt → triage_1..6
    → quest_roadmap → quest_hub → day_wrap → feedback`), and a thin `main.py` HTTP layer.
  - Added `POST /api/flow/action` (`FlowActionRequest` → `FlowStepResponse` of declarative `UIComponentSchema`
    list). Frontend now posts actions (`SUBMIT_QUERY`, `NEXT_STEP`, `SELECT_OPTION`, `BACK`, `RESET`, `RETRY`)
    and mounts the returned components.
  - Frontend: added `flow/` (`registry.tsx` maps component `type` → dumb Stitch block, `DynamicRenderer.tsx`,
    `useFlow.ts`), `pages/FlowScreen.tsx`; `/` now routes to the dynamic flow. Removed static `HomeScreen`,
    `GuidedSteps`, `QuestRoadmap`, `QuestHub`; sidebar nav reduced to Chat + Profile.
  - Gemini robustness: replaced the oversized `ranjanSir.md` (8.7k chars) system prompt with a concise
    `MENTOR_SYSTEM_PROMPT` and added a 60s HTTP timeout (fixes a full-context hang). Added stopword filter
    to the tokenizer.
  - Verified: flow transitions + BACK + `is_complete`; Gemini answer (17–20s) with correct sources;
    `npx tsc --noEmit` clean; `npm run build` passes.
