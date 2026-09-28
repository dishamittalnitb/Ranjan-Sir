# Architecture & Engineering Plan — Ranjan Sir Academic Strategist

> Author: Principal Engineer review
> Inputs: `PRD.md` (product spec, data models §5, API contract §6), `context.md`, `AGENTS.md`, existing `Backend/` (Markdown wiki + Python ingestion + prompt-driven mentor).
> Purpose: evaluate production-grade approaches and commit to a phased, scalable plan.

---

## 1. Requirements Synthesis & Architectural Drivers

### 1.1 What the product actually is
Not a content-heavy LMS and not a pure CRUD app. It is an **LLM-orchestrated, rules-governed
execution coach** with a thin, highly-polished UI. The system's "intelligence" is the mentor
(persona in `Backend/PROMPTS/ranjanSir.md`) operating over a curated academic knowledge graph.

Three distinct workloads emerge:

1. **Conversational / generative** (low latency, streaming) — chat, diagnostic insights, doubt desk.
2. **Deterministic / rules-driven** (transactional, correctness-critical) — triage steps, capacity
   adjustment (−35%), subject prioritization, quest unlock conditions (>80%), curfew/cognitive-cap
   enforcement, step-marking, load balancing. *These are the source of truth and must never be
   improvised by an LLM.*
3. **Content / knowledge** (read-heavy, versioned) — syllabus graph (162 chapters), PYQs (2022–25),
   NCERT. Serves as RAG ground truth.

### 1.2 Non-functional requirements that drive architecture

| Driver (from PRD) | Architectural consequence |
|---|---|
| Mentor must cite chapter/NCERT/PYQ, never hallucinate (§NFR-1) | Knowledge = versioned read-model + RAG with citations; LLM outputs constrained to corpus |
| Quest unlock, curfew, cognitive-cap are **server-authoritative** (§NFR-3/5) | Deterministic rules engine on the backend, not the client |
| Streaming mentor responses | SSE/WebSocket streaming; LLM token streaming end-to-end |
| OCR + step-marking verification with confidence (§NFR-4) | Vision/OCR service with audit trail; async job + result |
| Handwritten derivation uploads (~1.2 MB) (§6.6) | Object storage + signed uploads; virus/format validation |
| Per-student multi-tenant state (eventually many students) | Tenant-scoped data access, row-level security |
| Board-exam correctness (step-marking) | Versioned evaluation logic; golden-set regression tests |
| Low latency UX, calm/editorial feel | SPA; optimistic UI; cached read models |

### 1.3 The five "hard problems" and canonical solutions
1. **LLM + RAG over the wiki** → pgvector (or a dedicated vector store) over chunked `02_Syllabus_Graph`
   + `05_Exams_and_PYQs`; a "retrieval" step always precedes "generation"; every claim carries a
   source reference. Rules (capacity, curfew, unlock) are **enforced in code**, and the LLM is only
   allowed to *explain* them, never change them.
2. **Deterministic triage/quest engine** → pure domain service with unit-testable state machines
   (step graph, stage unlock conditions), not buried in an AI prompt.
3. **Streaming chat** → SSE for one-directional LLM token streams (simplest, replayable); upgrade to
   WebSockets only if presence/typing indicators become essential.
4. **Handwritten-derivation verification** → job queue (BullMQ) → vision model / OCR → step-marking
   validator → persisted `Attempt` with confidence + `methodVerdict`.
5. **Scheduling / load-balancing** → deterministic daily plan computation (curfew-aware), computed on
   session wrap and cached; cron for nightly wrap-up and streak rollovers.

---

## 2. Approach A — Modular Monolith (Recommended Primary)

### 2.1 Architecture
A single **NestJS (Node + TypeScript)** API organized by bounded context, a **React + Vite SPA**, and
**PostgreSQL** (with pgvector) + **Redis** + **object storage**. Domains are enforced with
compile-time module boundaries and communicate in-process via a typed application-service layer and a
lightweight domain-event bus. LLM, OCR, and scheduled work are out-of-process async via **BullMQ**.

Rationale: the product is one tightly-coupled workflow (triage → quest → practice → wrap). A monolith
with hard internal boundaries gives microservice-level modularity at a fraction of the operational
cost. Extract services later *only* at proven seams (chat/LLM, OCR).

### 2.2 Tech stack
- **Frontend:** React 18 + TypeScript, Vite, Tailwind (design tokens in `tailwind.config.js`),
  React Router, TanStack Query (server state/caching), Zustand (tiny UI state), React Hook Form + Zod
  (forms/validation), Material Symbols via `Icon`.
- **Backend:** NestJS, TypeScript, `class-validator`/`zod` DTOs.
- **Data:** PostgreSQL 16 (+ `pgvector`), Prisma ORM (typed, migrations). Redis 7 (cache + queues).
- **LLM:** Anthropic/OpenAI SDK behind a `MentorEngine` port; embeddings for RAG.
- **Files:** S3-compatible object storage (MinIO locally) with presigned uploads.
- **Queue:** BullMQ (OCR, nightlies, exports, notifications).
- **Tests:** Vitest (unit), Testcontainers/Prisma (integration), Playwright (E2E).
- **Observability:** OpenTelemetry tracing, structured JSON logs (pino), Sentry, Prometheus/Grafana.

### 2.3 Monorepo & folder structure (domain-driven, pnpm + Turborepo)

```
ranjan-sir/
├── apps/
│   ├── web/                       # React SPA
│   │   ├── src/
│   │   │   ├── app/               # router, providers, layout shell
│   │   │   │   ├── routes/        # route definitions (auth, triage, quest, practice…)
│   │   │   │   └── providers/     # query client, auth, theme, error boundary
│   │   │   ├── features/          # feature-based modules (not flat)
│   │   │   │   ├── chat/          #   chat.api.ts, useChat.ts, ChatThread.tsx, Composer.tsx
│   │   │   │   ├── triage/        #   triage.api.ts, TriageStepper.tsx, SubjectSelector.tsx
│   │   │   │   ├── quest/         #   quest.api.ts, QuestTimeline.tsx, useQuest.ts
│   │   │   │   ├── practice/      #   practice.api.ts, QuestionCard.tsx, DerivationUpload.tsx
│   │   │   │   ├── planning/      #   DayWrap, LoadCurve, FocusBlock
│   │   │   │   ├── profile/       #   ProfileForm, PerformanceLogs, Milestones
│   │   │   │   └── auth/
│   │   │   ├── components/        # shared design-system components (Button, StatusChip…)
│   │   │   ├── hooks/             # shared hooks (useDebounce, useCurfewTimer)
│   │   │   ├── lib/               # cx, api client, format utils
│   │   │   ├── types/             # shared domain types (mirror PRD §5)
│   │   │   └── test/              # test utils, mocks, fixtures
│   │   └── package.json
│   └── api/                       # NestJS modular monolith
│       ├── src/
│       │   ├── main.ts            # bootstrap, global pipes/filters/interceptors
│       │   ├── app.module.ts
│       │   ├── modules/           # one folder per bounded context
│       │   │   ├── identity/      #   student, preferences, auth
│       │   │   ├── chat/          #   conversation, messages, doubt-desk
│       │   │   ├── triage/        #   sessions, steps, subject priority
│       │   │   ├── quest/         #   quest, stages, unlock rules
│       │   │   ├── practice/      #   questions, attempts, OCR, step-marking
│       │   │   ├── planning/      #   focus blocks, day-plan, load-balance
│       │   │   ├── analytics/     #   performance, streak, syllabus coverage, milestones
│       │   │   └── knowledge/     #   syllabus graph, PYQ, retrieval (read-model)
│       │   ├── shared/            # shared kernel: db, config, errors, auth, events, validation
│       │   ├── infrastructure/    # prisma client, redis, queue, storage, llm, ocr adapters
│       │   └── test/
│       │   ├── prisma/schema.prisma
│       │   └── Dockerfile
├── packages/
│   ├── contracts/                 # shared TS types + zod schemas + OpenAPI spec (single source)
│   ├── ui-tokens/                 # Tailwind preset / tokens consumed by web
│   └── config-eslint / config-ts
├── infra/                         # Terraform/ Pulumi + docker-compose + k8s manifests
├── docs/                          # ADRs, runbooks
├── turbo.json / pnpm-workspace.yaml / .github/workflows/
```

**Where files live (convention):**
- `features/<domain>/<domain>.api.ts` — one file per feature encapsulating all HTTP calls for that
  domain (typed against `packages/contracts`).
- `features/<domain>/use<X>.ts` — TanStack Query hooks (server state) or Zustand stores (UI state).
- `features/<domain>/<Component>.tsx` — presentational components; data flows in via props/hooks.
- `components/` — only truly shared design-system primitives (Button, Icon, StatusChip…), never
  business logic.
- `api/src/modules/<context>/` — each context contains `controller` (HTTP), `service` (app logic),
  `repository` (data), `domain` (entities/state machines), `dto`, `*.spec.ts`.
- `shared/` & `infrastructure/` — cross-cutting adapters (LLM, OCR, storage) behind ports, so the
  domain never imports a vendor SDK directly.

### 2.4 Modularity guarantees
- Module boundaries enforced by ESLint `@nrwl/nx`-style rules (`no-restricted-imports` between contexts)
  and `dependency-cruiser`.
- Contexts communicate via typed application services + domain events (in-process); no cross-context
  table access. Foreign references are IDs + event replays, not joins.
- `packages/contracts` is the **single source of truth** for request/response/DTO shapes and domain
  types, generated into both apps (tRPC/OpenAPI codegen optional).

### 2.5 Cross-cutting (state, auth, realtime, uploads, jobs)
- **State:** TanStack Query for all server data (cache, retries, invalidation); Zustand only for UI
  (sidebar collapse, doubt-desk open). Never duplicate server state in Redux.
- **Auth:** session cookie (httpOnly) + refresh rotation; RBAC roles (student, guardian, mentor/system);
  tenant-scoping via request context. OAuth later (Google).
- **Realtime:** SSE endpoint for streaming mentor tokens; Redis pub/sub for cross-instance fan-out when
  scaled; BullMQ for async jobs (OCR, exports, nightly wrap, streak).
- **Uploads:** presigned S3 URLs, size/type allow-list, server-side validation; derivation → OCR job →
  result persisted with confidence; virus scan optional at higher tiers.
- **Deterministic rules:** `quest` unlock conditions, `triage` capacity adjustment, `planning` curfew
  are pure functions/state machines with exhaustive unit tests (golden sets).

### 2.6 DevOps / CI/CD / Testing
- **CI (GitHub Actions):** lint → typecheck → unit → integration (Testcontainers Postgres/Redis) →
  build → E2E (Playwright) on PRs; artifact publish; auto-tag.
- **Testing pyramid:** unit (domain/state machines, ~60%), integration (repos + modules, ~30%),
  E2E (critical journeys: triage→quest→practice→wrap, ~10%). Golden-set tests for step-marking.
- **Observability:** OTel spans per request + LLM call; pino structured logs with `traceId`,
  `studentId`, `domain`; Sentry for errors; Prometheus metrics (latency, LLM cost/tokens, queue depth,
  OCR confidence distribution); Grafana dashboards + alerts.
- **Deploy:** containerized API; DB via managed service; CD pipeline (staging→canary→prod). IaC via
  Terraform. Feature flags (LaunchDarkly/OpenFeature) for mentor-behavior changes.

### 2.7 Pros / Cons / Complexity / Effort
- **Pros:** one deploy, simple transactions, fast iteration, full type-safety across the stack,
  cheap to run, easy local dev (docker-compose), domain boundaries preserved for later extraction.
- **Cons:** single blast radius; all-or-nothing scaling; must discipline module boundaries; a bad
  dependency graph can regress to a "big ball of mud" without lint enforcement.
- **Complexity:** moderate (most senior teams' default). **Effort:** MVP ~6–8 eng-weeks for 2 engineers;
  full feature set ~12–16 eng-weeks.

---

## 3. Approach B — Event-Driven Microservices

### 3.1 Architecture
Extract the natural seams into independently deployable services behind an API gateway, communicating
via async events (Kafka/NATS) and a shared event schema:

1. `identity` (auth, students, preferences)
2. `mentor` (chat, LLM, streaming, doubt desk)
3. `triage-quest` (guided flow + adaptive quest rules)
4. `practice` (questions, attempts, OCR/step-marking)
5. `planning` (focus blocks, day plan, load balancing)
6. `analytics` (read model, projections, dashboards)
7. `knowledge` (wiki ingestion, embeddings, retrieval/RAG)

Plus a `gateway` (BFF) and an `event-bus`. Each service owns its own DB (database-per-service).

### 3.2 Tech stack
Same language/framework base as Approach A (Node + NestJS or Go for hot paths), but per-service:
- **Gateway/BFF:** GraphQL or thin REST BFF aggregating for the SPA.
- **Bus:** Kafka (or NATS JetStream) with schema registry (Avro/JSON Schema) via `packages/contracts`.
- **Knowledge/RAG:** dedicated service with pgvector + embedding pipeline (offline batch ingestion from
  the Markdown wiki).
- **Mentor/OCR:** GPU-scalable services (LLM gateway + vision model), separately autoscaled.

### 3.3 Folder structure (polyrepo or monorepo)
Monorepo (`services/<name>`) or polyrepo; each service has the same internal layout as one
`apps/api/src/modules/<context>` from Approach A (controller/service/repository/domain/dto), plus its
own `migrations`, `Dockerfile`, and `infra`.

### 3.4 Pros / Cons / Complexity / Effort
- **Pros:** independent scaling (mentor/OCR scale independently), fault isolation, teams own services,
  best long-term ceiling, per-service tech choice.
- **Cons:** distributed transactions (Sagas), eventual consistency everywhere (streak/analytics need
  projections), higher ops burden, harder local dev, more failure modes, needs strong platform team.
- **Complexity:** high. **Effort:** 2–3× Approach A for the same feature set; needs platform tooling
  (observability, service mesh, schema registry) from day one.

> Verdict: premature for this product's current scale, but the **exact seams to split on** are the
> domains above. Adopt only when chat/LLM or OCR latency/throughput genuinely diverges.

---

## 4. Approach C — Serverless / FaaS

### 4.1 Architecture
Next.js (App Router) front-end + API routes/server actions on Vercel/Cloudflare; Neon or Supabase
(Postgres + pgvector + Auth + Storage + Edge Functions); LLM calls at the edge; SSE streaming via
edge functions; jobs via Upstash QStash/Inngest.

### 4.2 Tech stack
Next.js 14+, React Server Components, Supabase (auth + Postgres + storage + realtime), Upstash Redis,
Inngest (durable workflows for OCR/nightlies), Vercel hosting.

### 4.3 Pros / Cons / Complexity / Effort
- **Pros:** fastest path to a live MVP, minimal infra, per-request scaling, integrated auth/storage.
- **Cons:** cold starts on LLM streaming, vendor lock-in, long-running OCR/nightly jobs awkward,
  deterministic domain state machines are harder to test/version than a service, cost unpredictability
  at scale, weaker transactional guarantees across workflows.
- **Complexity:** low initially, rises sharply with the deterministic rules + streaming + OCR needs.
- **Effort:** MVP ~3–4 eng-weeks, but Phase-2+ features accrue technical debt.

> Good for a throwaway prototype/demo; not the recommended target for the deterministic,
> rules-governed core of this product.

---

## 5. Approach D — Python/FastAPI Monolith (leverages existing backend)

### 5.1 Why it's worth listing
The current `Backend/` is already Python (`cbse.py`, `pyq.py`, `fix.py`) over a Markdown knowledge
base, and the LLM/ML ecosystem (LangChain, vision OCR, pymupdf4llm) is Python-first.

- **Stack:** FastAPI + SQLAlchemy/Alembic + PostgreSQL(+pgvector) + Redis + Celery/RQ; Pydantic models;
  LangChain/LlamaIndex for RAG; React SPA unchanged on the frontend.
- **Pros:** direct reuse of ingestion scripts and LLM/OCR tooling; strongest AI ecosystem.
- **Cons:** two languages across the stack (loses end-to-end TS type-safety and the shared
  `packages/contracts` codegen), weaker opinionated DI/module structure than NestJS unless enforced.
- **Effort:** comparable to Approach A for MVP; higher long-term cost from the language split.

> Valid alternative if the team is Python-first. The knowledge *ingestion* pipeline stays Python
> regardless — it's a batch tool, not the application server.

---

## 6. Recommendation & Justification

### Primary: **Approach A — Modular Monolith (NestJS + React SPA)**
Chosen because:
1. The product is **one coherent workflow**; transactions (triage → quest → wrap) are simpler in a
   single DB. The "scale" axis is LLM/OCR, which is already **out-of-process** (async via BullMQ +
   managed model APIs), so the monolith itself rarely needs to split.
2. **End-to-end TypeScript** lets `packages/contracts` be the single source of truth (types + zod +
   OpenAPI) consumed by both apps — eliminating the #1 source of integration bugs.
3. **Deterministic rules (curfew, capacity, quest unlock, step-marking)** are the product's moat and
   are best expressed as pure, unit-tested domain services in a typed language — not in prompts or FaaS.
4. It preserves clean **DDD boundaries** so any domain (mentor, practice) can be extracted into a
   service later without a rewrite.

### Secondary (fallback if team is Python-first): **Approach D — FastAPI monolith**
Same modular principles, better AI-tooling reuse; accept the language split and enforce structure
explicitly (a `modules/<context>/` layout mirroring Approach A).

### Explicitly deferred (revisit at scale)
- Microservices (Approach B) — only at proven seams (mentor/LLM throughput, OCR).
- Serverless (Approach C) — only for a demo/prototype, not the rules-governed core.

---

## 7. Phased Development Roadmap

### Phase 0 — Foundations (Week 0–1)
- Monorepo scaffold (pnpm + Turborepo), `packages/contracts`, CI pipeline, docker-compose
  (Postgres+pgvector, Redis, MinIO), lint/typecheck/test gates, design-system components + Tailwind
  token parity with Stitch.

### MVP (Weeks 2–8) — "The guided triage loop"
- Auth (single student, session cookie), student profile CRUD.
- Knowledge read-model: import `02_Syllabus_Graph` + PYQ index into Postgres (idempotent, versioned).
- Chat with mentor (LLM + RAG with citations), streaming (SSE).
- **Deterministic triage engine**: Steps 1–6 state machine, capacity adjustment, subject priority.
- Quest roadmap + stage unlock rules (server-authoritative).
- Doubt Desk. Focus-block timer. Day-wrap (basic).
- Frontend routes: Home, Profile, GuidedSteps, QuestRoadmap, QuestHub (already scaffolded).
- **MVP exit:** a student can ask "what should I do today?" and receive a rule-valid, cited plan.

### Phase 1 (Weeks 9–16) — Practice, OCR & analytics
- Targeted practice: question bank ingestion (chapters + PYQs), MCQ attempt flow.
- Handwritten derivation upload → OCR job → step-marking verification with confidence + audit trail.
- Analytics: performance logs, streak, syllabus coverage, milestones; load-balance across Wed–Sat.
- Exports (parent/student log), notifications, error tracking hardening.

### Phase 2 (Weeks 17–24) — Scale & intelligence
- Multi-student roster + guardian role + RBAC; tenant-scoped queries.
- Spaced-repetition / decay scheduler over knowledge state; adaptive quest re-routing.
- Extract `mentor` (LLM) and/or `practice` (OCR) into services if load demands (Approach B seams).
- Mobile-responsive PWA; offline read mode.

### Phase 3 (Weeks 25+) — Platform
- Additional boards/curricula, content-authoring pipeline, admin analytics, SOC2-aligned controls,
  cost-aware LLM routing (model tiering), canary deployments and chaos drills.

---

## 8. Cross-Cutting Engineering Standards (applies to every approach)

- **Testing:** domain state machines 100% covered with golden sets; repository/module integration via
  Testcontainers; E2E for the 4 critical journeys. Code coverage gate on `modules/*/domain`.
- **CI/CD:** trunk-based dev, short-lived PRs, required checks (lint/typecheck/unit/integration/E2E),
  semantic-release versioning, staging→canary→prod, auto-rollback.
- **Observability:** every request/LLM call/queue job gets a `traceId`; structured logs; Sentry;
  RED+golden signals; dashboards for latency, token cost, queue depth, OCR confidence.
- **Security:** OWASP defaults, parameterized queries (ORM), RBAC + tenant scoping, signed uploads,
  secret management (Vault/SSM), rate limiting, LLM output validation + prompt-injection guards,
  PII minimization.
- **Config/feature flags:** mentor behavior and rule thresholds behind flags, never hardcoded.

---

*Next step: open a `docs/adr/` set and implement `0001-choose-modular-monolith.md` + scaffold the
monorepo and `packages/contracts`.*
