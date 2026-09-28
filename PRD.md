# PRD — Ranjan Sir Academic Strategist

> Generated from the Stitch project **"Ranjan Sir Academic Strategist"** (`projects/16137700896185762344`, type `TEXT_TO_UI_PRO`, device `DESKTOP`).
> 58 screens, 1 design system asset ("Executive Academic Strategy"), 1 logo asset ("Ranjan Sir Monogram"), plus uploaded reference images (WhatsApp schedule photos, handwritten derivation scans).

---

## 1. Product Overview

### 1.1 Vision
Ranjan Sir is an **AI academic execution mentor** for CBSE Class 10 students. It does not teach subjects from scratch — it enforces discipline, protects the student's cognitive bandwidth, detects knowledge decay and prerequisite blockers, and converts "what should I do today?" into a bounded, board-exam-aligned execution plan.

The core promise, repeated across the UI: **"Protect today's classes. The week will balance itself."**

### 1.2 The Product (as expressed in the UI)
The prototype contains two distinct but complementary surfaces that share one underlying system:

1. **The Execution Engine** — a left-sidebar workspace (`Today's Focus`, `Workload Triage`, `School Homework`, `Upcoming Exams`, `Targeted Practice`, `Revision & Notes`, `Performance Log` / `Student Record`) that surfaces diagnostics, sprints, and load-balancing.
2. **The Chat-with-Ranjan-Sir Guided Flow** — a 6-step conversational triage sequence (plus quest roadmap + live quest hub) that walks the student from a vague "what do I do today?" to a single time-boxed, high-yield action.

Key product pillars visible in the UI:

- **Triage-first planning** — heavy coaching day → capacity reduction → week protection → subject prioritization → prerequisite bridge → execution.
- **Cognitive-load protection** — a strict bedtime curfew (22:30 IST), daily cognitive caps (45–60 min typical, 30–45 min recovery, 60–75 min exam weekend), fatigue detection, and automatic workload reduction.
- **Adaptive quest routing** — a locked, 4-stage learning path with conditional unlock rules, remedial forks, and re-routing.
- **Parallel Doubt Desk** — every step carries tracked context, a "Pedagogical Rule", and pre-populated clarification doubts that can be answered concurrently without interrupting the flow.
- **Board-exam alignment** — CBSE step-marking, PYQ references, syllabus coverage tracking, and target-score milestones.

### 1.3 Brand & Design System
The "Executive Academic Strategy" design system projects authority and calm control:

- **Palette**: Light theme; slate/ink structural base (`#091426` primary, `#1E293B` primary-container, `#F8F9FF` background) with semantic accents — **British Racing Green `#15803D`** (verified/execution milestone) and **Muted Amber `#B45309`** (attention/strategic triage).
- **Typography**: Inter, with tight negative letter-spacing on headlines and a `label-caps` token for table headers/status states.
- **Shape & Elevation**: 8px base radius, low-contrast hairline borders, three shadow levels (card → hover → modal).
- **Components**: solid primary buttons (36px height), secondary/ghost buttons, status chips (Verified/Attention/Neutral), form inputs with `#1E293B` focus ring, 16px selection controls, strategic execution cards, and 44px triage rows.

### 1.4 Scope
**In scope (screens present):** home chat, guided triage flow (6 steps), quest roadmap + live hub, execution dashboard, targeted-question practice, focus-block interstitial, day-wrap/load-balancer, student profile & academic record.

**Out of scope (not in current screens):** authentication/sign-up, billing, in-app video calling UI, multi-student roster management UI, admin/parent portal (only an "Export to Parent/Student Log" action is referenced).

---

## 2. User Personas

### P1 — The Student (Class 10, CBSE)
- **Prototype persona**: "Arjun Sharma", Enrollment ID `RS-2026-X10`, Tier 1 mentorship, ACTIVE. (Backend OS names the student "Aditi".)
- **Institution**: The Mother's International School, New Delhi.
- **Goals**: Know what to study tonight, stop getting stuck on integration/rotation problems, hit `96%+` / `75/80` targets, avoid burnout, keep an 18-day streak.
- **Constraints**: Heavy coaching days (7.5h), Wednesday fatigue, strict 22:30 bedtime curfew, 45–60 min daily cognitive cap.
- **Pain points**: Method-selection errors under time pressure (by-parts vs substitution), prerequisite gaps (NLM blocking Rotational Mechanics), late-night cognitive spillover.
- **Attitudes**: Disciplined but prone to overwork; needs an authority figure to say "stop".

### P2 — The AI Academic Strategist ("Ranjan Sir")
- **Role**: System persona / mentor voice. Firm, encouraging, Socratic.
- **Behaviors**: Detects fatigue, computes capacity adjustments (−35%), flags prerequisite blockers, time-boxes prerequisite debt, protects the sleep boundary, verifies method/derivations against CBSE step-marking.
- **Outputs**: Triage decisions, subject priority ordering, 4-stage quests, correction sprints, pedagogical rules, diagnostic insights, day-wrap summaries.

### P3 — The Parent / Guardian (secondary, referenced only)
- **Needs**: Confidence that the student is on pace and not burning out; receives an exported session summary ("Export Session Summary to Parent / Student Log").
- **Interactions**: Passive recipient of reports (not a first-class UI in the current prototype).

### P4 — The Coaching/Tutor Context (background)
- Represents the student's external heavy coaching schedule that the system must integrate around (live lectures, class tests, homework sets like "Ex 4.2", "Sequence and Series problem set").

---

## 3. Core User Journeys

### J1 — "What should I do today?" (Guided Triage, happy path)
1. Student opens **Chat with Ranjan Sir** and picks the starter *"What Should I Do Today?"* (or types the same query).
2. **Step 1 (Heavy Coaching Schedule)** — Ranjan Sir detects a long Wednesday (7.5h coaching) and initiates *CALM_TRIAGE* protocol. Student clicks **Continue**.
3. **Step 2 (Capacity Triage)** — System applies −35% capacity; "Tonight's Load" is calibrated to *Light*. Student clicks **See what matters tonight**.
4. **Step 3 (Protecting the Week)** — Ranjan Sir states "Tonight isn't about clearing backlog. We're protecting the week." Student clicks **Show me how**.
5. **Step 4 (Subject Selection)** — Physics flagged **Blocking**, Maths **Protect**, Chemistry **Healthy**. Student clicks **Start with Physics**.
6. **Step 5 (Physics Dependency)** — Explains why NLM blocks Rotational Mechanics. Student proceeds.
7. **Step 6 (20-Min NLM Bridge)** — Ranjan Sir time-boxes the prerequisite ("20 minutes"). Student clicks **Start NLM Bridge**.
8. Student reaches **Today's Quest Route** — a 4-stage adaptive path, and begins **Stage 1: NLM Friction & Normal Reaction Bridge**.

### J2 — Quest execution with adaptive re-routing
1. From the quest roadmap, Stage 2 (**Moment of Inertia**) is *IN PROGRESS*; Stage 3 (**Rolling Mechanics**) is *Locked* pending a verified ≥80% equilibrium score.
2. Student hits friction on rotational equilibrium and opens the **Adaptive Remedial Fork** (*Monotonic Torque Drill*, 15 min) via **Inspect drill route**.
3. Alternatively, student uses route controls — **Request Lighter Route**, **Add 15m Buffer**, **Recalculate Path** — to re-plan.
4. On completion, the quest transitions to **Daily Review & Nightly Wrap** (15 min, target 22:30).

### J3 — Diagnostic correction sprint (integration method-selection)
1. In the **Execution Dashboard**, student asks *"Why do I get stuck with these integration problems?"*.
2. Ranjan Sir returns a **Diagnostic Insight** ("method selection is the primary blocker, not calculation speed") and proposes a **20-min Correction Sprint** (revise formulas → solve 10 foundational → 10 mixed timed).
3. Student clicks **START SPRINT**, or an alternative (*"Show me an example question first"*, *"Adjust sprint duration to 15m"*, *"defer homework"*).
4. A **focus block interstitial** starts a 20:00 timer, mutes distractions, and locks to 3 numerical problems.

### J4 — Targeted practice with method verification (Physics/Current Electricity)
1. Student enters **Targeted Question & Solution Verification** (Class Test Prep, Step 2 of 5).
2. Reads Question `PH-10-CE-048` (Ohm's Law / equivalent resistance with a circuit diagram), selects an option, and uploads a **handwritten derivation** (`handwritten_derivation_step2.jpg`, 1.2 MB).
3. System OCR-extracts 4 equations (99.4% confidence) and returns **Method Review**: verified with `3.0/3.0` step-marks and an exam-strategy note.
4. Student clicks **Next Question**; the diagnostic sequence advances Q1 → Q2.

### J5 — Day wrap & multi-day load balancing
1. Session 01 completes within the 45-min threshold (42m used, 3m safety delta, 94.8% efficiency).
2. **Intelligent Day Wrap** shows the remaining 125m debt balanced across the next 72 hours (Thu 35m, Fri rest, Sat 90m deep work).
3. Student clicks **Conclude for Today** and optionally **Export Session Summary to Parent / Student Log**.

### J6 — Profile maintenance
1. Student opens **Student Profile & Academic Record** to edit Full Name, Bio, Board & Grade, Institution, Exam Target, Cognitive Cap, and Priority Disciplines.
2. Student clicks **Update Profile** (or **Reset** to revert), and reviews **Performance Logs** (streak, syllabus coverage, cognitive cap, calendar cadence) and **Milestones & Badges**.

---

## 4. Functional Requirements per Screen

> Legend: **[FR-n]** unique requirement ID. Buttons/inputs are noted verbatim where meaningful.

### 4.0 Global Shell (applies to all screens)

- **[FR-G1]** Persistent collapsible left sidebar with brand ("Ranjan Sir" + Monogram), toggle collapse (72px ↔ 256px), and navigation links: Chat with Ranjan Sir, Student Profile & Records, and guided steps 1–8.
- **[FR-G2]** Header bar shows current student identity ("Arjun Sharma — Class 10 · CBSE"), academic-year context ("Academic Year 2024-25"), and a class/batch selector (`Class 11 · Calm Guided Flow` / `CBSE Class 10 Board Prep`).
- **[FR-G3]** Global search ("Search topics, formulas…"), notifications, and profile controls.
- **[FR-G4]** A **Parallel Doubt Desk** is available across the guided flow: collapsible right panel carrying *Tracked Context* (step number/title, rationale), a *Pedagogical Rule*, and pre-populated *Doubts/Clarifications*.
- **[FR-G5]** Consistent status chips: **Verified/Completed** (green), **Attention/Blocking/Triage** (amber), **Neutral/Draft** (slate).

### 4.1 Chat with Ranjan Sir (Home / Diagnostic Chatbot)

Screens: `c33abce64aaa4b16a63d6f6cef038239`, `8547990944571091020`, `f94e6508542040c2a70c430c038dc252`, `a67e60383ef84450a68b285ea1ce2f9c`.

- **[FR-1.1]** Empty-state greeting with helper text: *"Ask anything about your syllabus, concepts, exam prep, or study plan."*
- **[FR-1.2]** Prompt starters (chat bubbles): `Review Class 10 Math syllabus`, `Explain Ohm's Law derivation`, `What Should I Do Today?` / `Help me organize homework priority`.
- **[FR-1.3]** Message composer with text input, attach-file, mic, and send (`arrow_upward`) actions.
- **[FR-1.4]** Sending a message appends user message + Ranjan Sir response; a "Ranjan Sir … is typing/active" presence indicator.
- **[FR-1.5]** "Chat with Ranjan Sir" must route to the Guided Flow (J1) when the intent is daily planning.

### 4.2 Guided Triage Flow (Steps 1–6)

Screens (representative): Step 1 `632c0c8cac3f47c8bcbbd3597e08dd80`; Step 2 `d63a98f192e8437c89c60f39e238826e`; Step 3 `0f910694158d4938829268470fd552e0`; Step 4 `f8df840ada1d4c3bbdcb57e0449fa12b`; Step 5 `8e70368898e142aa8eaf3c6c935be3a2`; Step 6 `edd9822d1601420fa8cec5a777ebd828`.

Common requirements:

- **[FR-2.1]** Progressive step indicator: `PHASE 01 · TRIAGE & CAPACITY` … `PHASE 03 · TODAY'S EXECUTION ROADMAP`, with `Step NN of 14` progress.
- **[FR-2.2]** Active-intent display ("Active Intent / Query: *what to do today*").
- **[FR-2.3]** Primary CTA per step, e.g. **Continue**, **See what matters tonight**, **Show me how**, **Start with Physics**, **Start NLM Bridge**, plus **Previous step** and **Why?/Why this order?** secondary links.
- **[FR-2.4]** Alternative-methods tray: `Alternative Methods`, `Week`, `Progress`, `Backlog`, `Reset`.

Per-step specifics:

- **[FR-2.5] Step 1 — Heavy Coaching Schedule:** detects high coaching load; presents `Calm Protocol Active`; Ranjan Sir's guidance text with **Continue**.
- **[FR-2.6] Step 2 — Capacity Triage:** shows `LIVE` status and "Tonight's Load: Calibrated (Light)"; explains `−35% study capacity` adjustment and 42% lower-retention rationale; CTAs **See what matters tonight** / **Why?**.
- **[FR-2.7] Step 3 — Protecting the Week:** states "We're protecting the week"; surfaces the rule *"Burnout protection precedes backlog recovery"*; CTA **Show me how**; 3 clarification doubts.
- **[FR-2.8] Step 4 — Subject Selection:** displays `TODAY'S PRIORITIES` with three selectable subject cards, each tagged **Blocking** (Physics/NLM), **Protect** (Maths), **Healthy** (Chemistry), with rationale; radio-style single-select; CTA **Start with Physics** / **Why this order?**.
- **[FR-2.9] Step 5 — Physics Dependency (Subject Blocker):** explains *why* Physics blocks Rotational Mechanics; pedagogical rule *"Never start with passive review when a conceptual block threatens today's live lecture."*
- **[FR-2.10] Step 6 — 20-Min NLM Bridge:** time-boxes prerequisite ("only enough NLM to unblock Rotational Mechanics. 20 minutes."); CTAs **Start NLM Bridge** / **What about Kinematics?**.

### 4.3 Today's Quest Route & Adaptive Path

Screens: `e47b796531164775a0b3ba23c5ffe82a`, `8695670237861811179`.

- **[FR-3.1]** Quest header: `PHASE 03 · TODAY'S EXECUTION ROADMAP`, step `08 of 14`, **Cognitive Load: Balanced**, **ADAPTIVE ACTIVE**, estimated time **95 MIN**.
- **[FR-3.2]** Four-stage vertical roadmap with states:
  1. **NLM Friction & Normal Reaction Bridge** — `Mastered & Verified` (20 min, Logged 08:15 AM).
  2. **Moment of Inertia & Parallel Axis Theorem** — `IN PROGRESS · 35 MIN`, "Live Sync Active", target 4 problem sets, **Engage Problem Set**.
  3. **Rolling Without Slipping Dynamics** — `Locked`, `lock_clock`, release condition: *verified equilibrium score >80% from Step 02* (25 min, Est. 09:30 AM).
  4. **Daily Review & Nightly Wrap** — `Milestone Goal` (15 min wrap, Target 22:30).
- **[FR-3.3]** **Adaptive Remedial Fork**: a 15-min branch (e.g., *Monotonic Torque Drill*) with **Inspect drill route**.
- **[FR-3.4]** Route controls: **Request Lighter Route**, **Add 15m Buffer**, **Recalculate Path**; live status line "Route Status: 1h 35m scheduled · 2 conceptual gates · Sleep protected".
- **[FR-3.5]** Embedded **Parallel Doubt Desk** with tracked context (STEP 5: SUBJECT BLOCKER) and 3 pre-populated doubts.

### 4.4 Connected Flow & Quest Discussion (Live Quest Hub)

Screens: `fc710985b7864e3394b2977b0f2aeeb4`, `7547649090720379584`, `92210a2564544239bb29b39179890732`.

- **[FR-4.1]** `Dynamic Learning Loop · Active Conversation` with quest-connected status ("Your 4-stage adaptive quest has been locked in.").
- **[FR-4.2]** Quest checklist with state icons: `check_circle 1. NLM Friction Bridge Verified`, `arrow_forward 2. Moment of Inertia Ready`, `arrow_forward lock 3. Rolling Mechanics`, `arrow_forward flag Target Wrap`.
- **[FR-4.3]** **Re-route Map** (`open_in_new`) and **Start Quest** (`play_arrow`) actions.
- **[FR-4.4]** Parallel free-form doubt chat ("Ask a doubt concurrently…") that does not interrupt the active conversation.

### 4.5 Academic Execution Dashboard / Focus Platform / Focus Triage

Screens: `60dd495272cb4345a8a4d0815b59f543`, `5de5339a604c43c185a3080784cdc364`, `759fe52ab96d40059ed4612d996d7299`, `ba7c68cde11f4361a0c2cdb26be7c67d`, `16f626cdddad4ddba20247d59223489f`, `259dfb00d0d64e7ab0709e27f37c39cc`, `0bb63e694315493b8e272ebf7b737ad7`, `c5e24fcc6b5849c398568fdfde8cc175`.

- **[FR-5.1]** Top-level workspace nav tabs: `Today's Focus`, `Workload Triage`, `School Homework`, `Upcoming Exams`, `Targeted Practice`, `Revision & Notes`, `Performance Log` / `Student Record`.
- **[FR-5.2]** Execution header: session date/time (`Today · 18:40 IST`), `Sprint ID #094`, `Daily Curfew: 22:30`, `Session Cap: 45 mins`, **Export Triage**, session phase stepper (1 Strategy & Diagnosis → 2 Practice Sprint → 3 Curfew & Review).
- **[FR-5.3]** Diagnostic chat thread showing user query → AI `Diagnostic Assessment` / `Verified Insight` (method-selection blocker), with **Start 20m Correction Sprint**.
- **[FR-5.4]** Sprint builder (3 steps): Revise formulas → Solve 10 foundational → 10 mixed timed, with **START SPRINT**; alternative actions: *example question first*, *adjust to 15m*, *defer homework*.
- **[FR-5.5]** Analytics panel: `Method Accuracy 68%` (−14% under 3 mins), `Tonight's Workload 1h 15m` (completes by 21:45), `Next Milestone Pre-Board Calculus 75/80`, curfew boundary.
- **[FR-5.6]** Diagnostic starters list (`Why do I get stuck…`, `Triage tonight's homework vs test prep`, `Review my handwritten circuit derivation`, `I feel overloaded tonight — what do I cut?`).
- **[FR-5.7]** Focus Triage variant shows subject cards (Ohm's Law · Series & Parallel) with **Start 20-Minute Focus Block**, and a **Sprint In Progress** state (timer, `Pause Session`, `Exit Block`, phone-silenced notice).

### 4.6 Targeted Question & Solution Verification

Screen: `3b65deac65954bc1802219d71ce633a8`.

- **[FR-6.1]** Practice header: `Physics Diagnostic / Class Test Prep · Step 2 of 5`, remaining focus-block time (14:21).
- **[FR-6.2]** Diagnostic sequence progress: Q1 done, Q2 current, Q3–Q5 locked (`lock_clock`).
- **[FR-6.3]** Question card with `Question ID: PH-10-CE-048`, stem, an SVG circuit diagram (R1 series with parallel R2/R3), and governing formulations (Ohm's Law, series/parallel resistance).
- **[FR-6.4]** Four options (A–D) with **Select** per option; a **Candidate Choice** highlight.
- **[FR-6.5]** Method derivation upload: attach `handwritten_derivation_step2.jpg` (1.2 MB), **Re-upload**, **Add PDF Note**, **Send for Method Review**.
- **[FR-6.6]** **Submitted Rough Sheet** panel with **Full Derivation** zoom, OCR extraction (4 equations, 99.4% confidence).
- **[FR-6.7]** **Ranjan Sir Engine** verification response: direct proportionality confirmed, equivalent-resistance computation, **Step Marks Expected 3.0/3.0**, exam-strategy note, **Next Question**.

### 4.7 Editorial Transition Interstitial (Focus Block)

Screens: `0ee2b9fb842d43838df7e865e56c46bb`, `17_Editorial_Transition_Interstitial`.

- **[FR-7.1]** Full-bleed focus block: execution principle headline, rationale paragraph, subject chip (Ohm's Law · Series & Parallel), `Target: 20 Minutes`, `CBSE Class 10 Physics`.
- **[FR-7.2]** **Start 20-Minute Focus Block** CTA with secondary actions **Adjust block duration to 15m** and **Review syllabus map**.
- **[FR-7.3]** In-progress state: countdown (20:00), focus (3 numerical problems · resistor combinations), **Pause Session**, **Exit Block**, phone-silenced notification, retention window (08:30 AM tomorrow).

### 4.8 Intelligent Day Wrap & Multi-Day Load Balancer

Screen: `c967268e591a4b41919fb3bd1c4e21ed`.

- **[FR-8.1]** Session wrap header: `SESSION 01 WRAP-UP`, `CBSE Term II Prep · Quadrilaterals & Mechanics`, `Daily Target: 100% Attained`, `Threshold Respected`.
- **[FR-8.2]** Cognitive metrics: `Cognitive Bandwidth 42m/45m` (3m safety delta), `Efficiency Ratio 94.8%` (+6% vs Mon), `Remaining Weekly Debt 125m across 2 sessions`, `No Sunday spill required`.
- **[FR-8.3]** **Load Curve (Wed–Sat)** visualization: Wed 42m, Thu 35m, Fri Rest, Sat 90m.
- **[FR-8.4]** Three-column multi-day plan: **Tonight · Secured** (test review, priority homework Q1–Q3, formula slate synced), **Tomorrow · Execution** (remaining homework Q4/Q5, in-school Physics test, error-correction block), **Saturday · Synthesis** (90m deep block: mind-map, comprehensive paper revision, weekly audit).
- **[FR-8.5]** Closing actions: **Export Session Summary to Parent / Student Log**, **Conclude for Today**, with confirmation ("Summary logged. Cognitive boundary protected for tonight.").

### 4.9 Student Profile & Academic Record

Screens: `7e303f0b58c54e8ebd49d8dd11255ab6`, `769361143025129019`, `4793d5140d35472697e7ad19fb54d1f6` (rendered React source also in `e356ec52b19440f5b52c53962cc9b336`).

- **[FR-9.1]** Identity header: avatar (with **Update Avatar**), name, `Enrollment ID: RS-2026-X10`, `ACTIVE · TIER 1 MENTORSHIP`, bio.
- **[FR-9.2]** Editable form fields: **Full Name**, **Bio** (textarea), **Board & Grade** (dropdown: CBSE Class 10/11/12, ICSE Class 10), **Registered Institution**, **Core Examination Target**, **Daily Cognitive Cap & Curfew** (dropdown: 45–60m / 30–45m recovery / 60–75m exam weekend), **Current Priority Disciplines** (Mathematics, Science, English with **+ Add Subject**).
- **[FR-9.3]** Form actions: **Reset** and **Update Profile** (shows saved state).
- **[FR-9.4]** **Performance Logs**:
  - Consistency Streak: `18-DAY STREAK ACTIVE`, `94.2% Curfew Kept`, 7-day sprint cadence (M–S checkmarks), `Curfew Protocol (< 22:30 IST) Maintained`.
  - Syllabus Coverage: `84/126 topics`, `66.7%`, per-subject breakdown (Math 32/45, Science 36/52, English & Social 16/29), `Board Exam Pacing: On Pace for 96%+`.
  - Daily Cognitive Cap: `48m Avg`, `Within 60m Ceiling 91.8%`, `420+ Qs Solved`, `0 Over-Cap Events`.
  - Calendar Cadence (Feb 2026, month navigation): per-day cells showing minutes, status (Planned Rest/Completed/Scheduled), and activity label (e.g., "Math Poly Tri", "Ray Diag (4/4 qs)").
- **[FR-9.5]** **Milestones and Badges** (4 crests): Curfew Compliance (12/15), Pure Derivation & Proofs (44/50), Exam Preparedness Readiness (Completed), Academic Momentum (88% in progress).

### 4.10 Assets

- **[AS-1] Design system** — "Executive Academic Strategy": colors, typography scale, spacing, elevation, component tokens (see §1.3).
- **[AS-2] "Ranjan Sir Monogram"** — 40×40 SVG brand mark used in sidebar/header.
- **[AS-3] Uploaded reference images** — WhatsApp coaching-schedule photos and handwritten derivation scans (`handwritten_derivation_step2.jpg`) consumed by the OCR/verification flow (§4.6) and triage context.

---

## 5. Data Models / Schemas

### 5.1 Student
```jsonc
{
  "id": "string",                // e.g. "RS-2026-X10"
  "fullName": "string",
  "bio": "string",
  "board": "enum[CBSE|ICSE]",
  "grade": "enum[10|11|12]",
  "institution": "string",
  "examTarget": "string",        // e.g. "CBSE Board Examination 2026 · Target 96%+"
  "enrollmentTier": "enum[TIER_1|TIER_2|TIER_3]",
  "status": "enum[ACTIVE|PAUSED|GRADUATED]",
  "avatarUrl": "string?",
  "academicYear": "string",      // "2024-25"
  "curfew": "time",              // 22:30 IST
  "createdAt": "datetime"
}
```

### 5.2 StudentPreferences (cognitive contract)
```jsonc
{
  "studentId": "string",
  "dailyCognitiveCapProfile": "enum[STANDARD_45_60|RECOVERY_30_45|EXAM_60_75]",
  "capMinutes": "int",            // 60
  "curfewTime": "time",           // "22:30"
  "priorityDisciplines": ["enum[MATHEMATICS|SCIENCE|ENGLISH_LIT|SOCIAL_SCIENCE]"],
  "targetScorePct": "number"      // 96.0
}
```

### 5.3 Subject / Priority
```jsonc
{
  "id": "string",
  "name": "string",              // "Physics"
  "status": "enum[BLOCKING|PROTECT|HEALTHY|COMPLETED]",
  "rationale": "string",          // "NLM prerequisite for Rotational Mechanics"
  "coverage": { "topicsCompleted": "int", "topicsTotal": "int" }
}
```

### 5.4 ChatMessage
```jsonc
{
  "id": "string",
  "conversationId": "string",
  "sender": "enum[USER|MENTOR|SYSTEM]",
  "text": "string",
  "kind": "enum[TEXT|DIAGNOSTIC_INSIGHT|TRIAGE_DECISION|SPRINT_PROPOSAL]",
  "sprintId": "string?",
  "createdAt": "datetime"
}
```

### 5.5 GuidedFlowSession (triage)
```jsonc
{
  "id": "string",
  "studentId": "string",
  "protocol": "enum[CALM_TRIAGE|PRIORITIZATION|EXECUTION]",  // e.g. CALM_TRIAGE_v2.4
  "phase": "enum[PHASE_01_TRIAGE|PHASE_02_PRIORITIZATION|PHASE_03_ROADMAP]",
  "currentStep": "int",           // 1..14
  "steps": [ { "number": "int", "title": "string", "status": "enum[ACTIVE|DONE|LOCKED]" } ],
  "capacityAdjustmentPct": "number",  // -35
  "fatigueDetected": "boolean",
  "selectedSubject": "string?",
  "createdAt": "datetime"
}
```

### 5.6 DoubtDesk / Doubt
```jsonc
{
  "id": "string",
  "stepNumber": "string",
  "stepTitle": "string",
  "rationale": "string",
  "pedagogicalRule": "string",
  "presetDoubts": ["string"],
  "chatHistory": [ { "sender": "enum[USER|MENTOR]", "text": "string", "at": "datetime" } ]
}
```

### 5.7 Quest / QuestStage
```jsonc
{
  "id": "string",
  "studentId": "string",
  "title": "string",             // "Rotational Mechanics Unblock Flow"
  "estimatedMinutes": "int",     // 95
  "cognitiveLoad": "enum[LIGHT|BALANCED|HEAVY]",
  "stages": [
    {
      "order": "int",            // 1..4
      "title": "string",
      "status": "enum[MASTERED_VERIFIED|IN_PROGRESS|LOCKED|PENDING]",
      "allocatedMinutes": "int",
      "target": "string",        // "Target: 4 Problem Sets"
      "releaseCondition": { "scorePct": "number", "sourceStage": "int" }  // >80% from stage 2
    }
  ],
  "remedialFork": { "title": "string", "minutes": "int", "trigger": "string" },
  "routeControls": ["REQUEST_LIGHTER|ADD_BUFFER|RECALCULATE"]
}
```

### 5.8 Question / PracticeAttempt
```jsonc
{
  "id": "string",                // "PH-10-CE-048"
  "subject": "string",           // "Physics · Current Electricity & Ohm's Law"
  "stem": "string",
  "options": ["string"],         // A..D
  "correctOption": "enum[A|B|C|D]",
  "governingFormulations": ["string"],
  "diagramUrl": "string?",
  "stepMarks": "number",         // 3.0
  "diagnosticSequence": [ { "order": "int", "status": "enum[DONE|CURRENT|LOCKED]" } ]
}

{
  "attempt": {
    "id": "string",
    "questionId": "string",
    "selectedOption": "enum[A|B|C|D]?",
    "derivationUpload": { "fileName": "string", "sizeBytes": "int", "url": "string" },
    "ocr": { "equationsExtracted": "int", "confidence": "number" },
    "methodVerdict": "enum[VERIFIED|NEEDS_REVIEW]",
    "stepMarksAwarded": "number",
    "examStrategyNote": "string"
  }
}
```

### 5.9 StudySession (focus block)
```jsonc
{
  "id": "string",
  "studentId": "string",
  "type": "enum[FOCUS_BLOCK|CORRECTION_SPRINT|QUEST_STAGE]",
  "plannedMinutes": "int",
  "usedMinutes": "int",
  "status": "enum[PLANNED|IN_PROGRESS|COMPLETED|PAUSED|EXITED]",
  "focus": "string",
  "phoneSilenced": "boolean",
  "retentionWindow": "datetime?"
}
```

### 5.10 DayPlan / LoadBalance (day wrap)
```jsonc
{
  "date": "date",
  "dailyTargetAttainedPct": "number",     // 100
  "cognitiveBandwidth": { "used": "int", "allotted": "int" },
  "efficiencyRatioPct": "number",          // 94.8
  "remainingWeeklyDebtMinutes": "int",     // 125
  "loadCurve": [ { "day": "enum[WED|THU|FRI|SAT]", "minutes": "int", "label": "string" } ],
  "blocks": [
    { "bucket": "enum[TONIGHT|TOMORROW|SATURDAY]", "items": [ { "title": "string", "minutes": "int", "status": "enum[COMPLETED|PLANNED]" } ] }
  ],
  "summaryLogged": "boolean"
}
```

### 5.11 PerformanceLog / CalendarEntry
```jsonc
{
  "studentId": "string",
  "streakDays": "int",                       // 18
  "curfewKeptPct": "number",                 // 94.2
  "sprintRun": "int", "sprintPeak": "int",
  "syllabusCoverage": { "topicsCompleted": "int", "topicsTotal": "int", "bySubject": { "subject": "string", "done": "int", "total": "int" } },
  "avgDailyMinutes": "int",                  // 48
  "withinCapPct": "number",                  // 91.8
  "questionsSolved": "int",                  // 420+
  "overCapEvents": "int",                    // 0
  "calendar": [
    { "date": "date", "minutes": "int", "status": "enum[COMPLETED|PLANNED_REST|SCHEDULED]", "label": "string" }
  ]
}
```

### 5.12 Milestone / Badge
```jsonc
{
  "id": "string",
  "title": "string",
  "status": "enum[UNLOCKED|MASTERED|IN_PROGRESS]",
  "metric": { "numerator": "int", "denominator": "int" },
  "description": "string"
}
```

---

## 6. API Contract Requirements

> Base path `/api/v1`. Auth via bearer token (Student/Guardian). All timestamps ISO-8601. Errors return `{ "code": "string", "message": "string" }`.

### 6.1 Student & Profile
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/students/{id}` | Fetch identity, tier, status. |
| `GET` | `/students/{id}/preferences` | Cognitive cap, curfew, priority disciplines. |
| `PUT` | `/students/{id}/profile` | Update full name, bio, board/grade, institution, exam target (drives §4.9). |
| `PUT` | `/students/{id}/preferences` | Update cognitive cap profile + priority subjects. |
| `POST` | `/students/{id}/avatar` | Upload/update avatar. |

### 6.2 Chat & Triage
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/chat` | Send message; returns mentor reply (may include `diagnostic_insight`, `triage_decision`, or `sprint_proposal`). |
| `GET` | `/chat/{conversationId}` | Fetch history. |
| `POST` | `/triages` | Start guided flow (from "what to do today"). Returns `GuidedFlowSession`. |
| `GET` | `/triages/{sessionId}` | Current phase/step/capacity data. |
| `POST` | `/triages/{sessionId}/steps/{step}/advance` | Advance step (Continue / Start with Physics / Start NLM Bridge). |
| `POST` | `/triages/{sessionId}/subject` | Select subject priority. |
| `GET` | `/triages/{sessionId}/doubt-desk` | Tracked context + preset doubts for current step. |
| `POST` | `/triages/{sessionId}/doubt-desk/messages` | Post a parallel doubt (does not advance flow). |

### 6.3 Quest & Routing
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/quests/active` | Current 4-stage quest + statuses. |
| `POST` | `/quests/{questId}/stages/{stage}/start` | Start/engage a stage. |
| `POST` | `/quests/{questId}/stages/{stage}/complete` | Complete stage; triggers unlock evaluation (≥80% rule). |
| `GET` | `/quests/{questId}/remedial-fork` | Fetch adaptive remedial drill. |
| `POST` | `/quests/{questId}/reroute` | Apply route control (`REQUEST_LIGHTER` / `ADD_BUFFER` / `RECALCULATE`). |

### 6.4 Diagnostic & Practice
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/diagnostics` | Submit student query; returns insight + sprint proposal. |
| `POST` | `/sprints` | Create correction sprint (revise → foundational → mixed). |
| `POST` | `/sprints/{id}/start` / `/pause` / `/exit` | Sprint lifecycle. |
| `GET` | `/questions/{id}` | Fetch question stem, options, diagram, formulations. |
| `POST` | `/questions/{id}/attempt` | Submit selected option. |
| `POST` | `/questions/{id}/derivation` | Upload handwritten derivation (multipart). |
| `POST` | `/questions/{id}/method-review` | Request OCR + method verification; returns step-marks + strategy note. |
| `POST` | `/questions/{id}/next` | Advance diagnostic sequence. |

### 6.5 Sessions, Day Wrap & Analytics
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/sessions` | Start focus block. |
| `PATCH` | `/sessions/{id}` | Pause/exit/complete (updates used minutes). |
| `GET` | `/day-wrap/{date}` | Cognitive bandwidth, efficiency, weekly debt, load curve. |
| `POST` | `/day-wrap/{date}/conclude` | Mark concluded + log summary. |
| `GET` | `/day-wrap/{date}/export` | Export summary (Parent/Student log). |
| `GET` | `/students/{id}/performance` | Streak, syllabus coverage, cap usage, calendar. |
| `GET` | `/students/{id}/milestones` | Badges/crests. |

### 6.6 Non-Functional & Contract Notes
- **[NFR-1]** Mentor responses must cite chapter/NCERT/PYQ references (backend `School_Master_Wiki`) — never hallucinate outside the wiki.
- **[NFR-2]** Triage decisions must return a rationale + capacity adjustment + pedagogical rule (not just an answer).
- **[NFR-3]** Quest unlock rules (`releaseCondition`) must be server-enforced, not client-side.
- **[NFR-4]** OCR/method review must return confidence and per-equation extraction for auditability.
- **[NFR-5]** All curfew/cognitive-cap enforcement is authoritative server-side (22:30 IST, 45–60 min caps).
- **[NFR-6]** Export/OCR/derivation uploads support `multipart/form-data` with size limits (derivations ~1.2 MB observed).
