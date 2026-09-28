# AGENTS.md — Developer Rules

Rules for the implementation agent. Read before touching any code. These are non-negotiable.

## 1. Stitch UI Fidelity

- The Stitch project (`projects/16137700896185762344`) is the **single source of truth** for all UI.
  Do not redesign, restyle, or "improve" a screen. Reproduce it.
- Use **only** design tokens defined in `frontend/tailwind.config.js` (`surface-*`, `on-*`, `primary`,
  `outline-*`, `secondary`, `tertiary`, `error`) — never hardcode colors/spacing not in the token set.
- Match fonts exactly: Inter (UI), Newsreader/Instrument Serif (editorial headlines), Space Mono (labels).
- Match component anatomy: button variants, status chips (Verified/Attention/Neutral), 36px inputs,
  16px selection controls, card/row styling, and copy. Keep the exact CTA labels and microcopy from Stitch.
- Material Symbols via the `Icon` component; never swap in emoji or other icon sets.

## 2. Strict Type Safety (TypeScript)

- All new code is **TypeScript** (`.tsx` / `.ts`). No `any`, no `unknown`-without-narrowing, no `// @ts-ignore`.
- Derive types from the **PRD.md §5 data models**. Put shared models in `frontend/src/types/`.
- Every component gets an explicit `Props` interface; every event handler/API function is typed.
- `frontend/src/data/mockData.*` must be typed and kept in sync with those models.
- The typed API client (`frontend/src/api/`) must mirror PRD.md §6 endpoints with request/response types.
- Migration rule: when touching an existing `.jsx`/`.js` file, convert it to `.tsx`/`.ts` in the same change.

## 3. Backend / Knowledge Integrity

- `Backend/School_Master_Wiki/01_Raw_Sources/` is **IMMUTABLE** — never modify or delete its contents.
- Academic content must come only from the wiki. Never invent syllabus, marks, PYQ, or step-marking details.
- Per-student state lives in `Backend/Student_OS_Aditi_Class10/`; `execution_log.md` and `log.md` are
  append-only. Follow the folder conventions in `context.md`.
- The mentor persona is defined in `Backend/PROMPTS/ranjanSir.md`. Don't duplicate or contradict it.

## 4. Code Conventions

- Reuse existing components in `frontend/src/components/`; don't duplicate a primitive in a page.
- Data flows via typed props from `pages/` → `components/`; keep mock data out of components.
- No comments unless the user explicitly asks. No emojis in code or copy.
- Follow existing file/style conventions (function components, named exports where established,
  `cx()` from `lib/cx.js` for conditional classes).

## 5. Process & Verification

- Never commit unless the user explicitly asks. Never push.
- Before finishing any implementation task, run the project's checks and make them pass:
  `npm run build` (and typecheck/lint if configured) from `frontend/`.
- Keep changes minimal and scoped to the request. Do not refactor unrelated code.
- If a convention is ambiguous, ask — do not assume.
