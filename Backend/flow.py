"""Backend-driven UI flow state machine.

The frontend posts ``FlowActionRequest`` (a user interaction) and receives a
``FlowStepResponse`` describing the next screen as a list of declarative components.
The frontend is a dumb renderer that mounts those components; all transitions live here.
"""
from __future__ import annotations

import uuid
from typing import Any, Dict, Optional

import engine
from schemas import FlowActionRequest, FlowStepResponse, UIComponentSchema


def _comp(ctype: str, **props: Any) -> UIComponentSchema:
    return UIComponentSchema(type=ctype, props=props)


# Static content the flow drives (could later come from the wiki / DB).
SUBJECTS = [
    {"id": "physics", "name": "Physics", "status": "blocking", "rationale": "NLM prerequisite for Rotational Mechanics"},
    {"id": "maths", "name": "Maths", "status": "protect", "rationale": "Sequence and Series after heavy coaching"},
    {"id": "chemistry", "name": "Chemistry", "status": "healthy", "rationale": "Stable maintenance block"},
]

COACHING_LOAD = [
    {"day": "Mon 13", "label": "Regular", "hours": "3.5 hrs", "width": "45%", "heavy": False},
    {"day": "Tue 14", "label": "Moderate", "hours": "4.0 hrs", "width": "53%", "heavy": False},
    {"day": "Wed 15 (Today)", "label": "Heaviest", "hours": "7.5 hrs", "width": "100%", "heavy": True},
]

QUEST_STAGES = [
    {"order": "01", "title": "NLM Friction & Normal Reaction Bridge", "status": "completed", "meta": "Mastered & Verified",
     "description": "Prerequisites verified • Free Body Diagram contact points validated with zero friction penalty.",
     "time": "20 min duration", "subtime": "Logged 08:15 AM"},
    {"order": "02", "title": "Moment of Inertia & Parallel Axis Theorem", "status": "in-progress", "meta": "IN PROGRESS • 35 MIN",
     "description": "Tackle continuous mass integration, perpendicular planar lamina transformations, and symmetry shortcuts.",
     "target": "Target: 4 Problem Sets", "remedial": "Monotonic Torque Drill (15m)"},
    {"order": "03", "title": "Rolling Without Slipping Dynamics", "status": "locked", "meta": "Locked",
     "description": "Requires verified equilibrium score (>80%) from Step 02.", "time": "25 min allocated"},
    {"order": "04", "title": "Daily Review & Nightly Wrap", "status": "goal", "meta": "Goal",
     "description": "Zero screen usage post 10:30 PM to guarantee full recovery.", "time": "Target 10:30 PM"},
]


class FlowEngine:
    def __init__(self) -> None:
        self._sessions: Dict[str, Dict[str, Any]] = {}

    _PREVIOUS = {
        "answer": "initial_prompt",
        "triage_1": "initial_prompt",
        "triage_2": "triage_1",
        "triage_3": "triage_2",
        "triage_4": "triage_3",
        "triage_5": "triage_4",
        "triage_6": "triage_5",
        "quest_roadmap": "triage_6",
        "quest_hub": "quest_roadmap",
        "day_wrap": "quest_hub",
    }

    def _session(self, session_id: Optional[str]) -> str:
        sid = session_id or uuid.uuid4().hex
        self._sessions.setdefault(sid, {"data": {}})
        return sid

    def handle(self, request: FlowActionRequest) -> FlowStepResponse:
        sid = self._session(request.session_id)
        session = self._sessions[sid]
        next_step = self._transition(request.step_id, request.action_type, request.payload, session)
        return self._render(next_step, sid, session)

    # -- transitions --------------------------------------------------------- #
    def _transition(self, step: str, action: str, payload: Dict[str, Any], session: Dict[str, Any]) -> str:
        if action == "RESET":
            return "initial_prompt"
        if action == "RETRY":
            return step
        if action == "BACK":
            return self._PREVIOUS.get(step, "initial_prompt")

        if step in ("initial_prompt", "answer", "quest_hub") and action == "SUBMIT_QUERY":
            query = str(payload.get("query", "")).strip().lower()
            session["data"]["query"] = query
            return "triage_1" if ("today" in query or "what" in query) else "answer"

        if step == "triage_1" and action == "NEXT_STEP":
            return "triage_2"
        if step == "triage_2" and action == "NEXT_STEP":
            return "triage_3"
        if step == "triage_3" and action == "NEXT_STEP":
            return "triage_4"
        if step == "triage_4" and action == "SELECT_OPTION":
            session["data"]["subject"] = payload.get("subject", "physics")
            return "triage_5"
        if step == "triage_5" and action == "NEXT_STEP":
            return "triage_6"
        if step == "triage_6" and action == "NEXT_STEP":
            return "quest_roadmap"
        if step == "quest_roadmap" and action == "NEXT_STEP":
            return "quest_hub"
        if step == "quest_hub" and action == "SELECT_OPTION":
            return "day_wrap"
        if step == "day_wrap" and action == "NEXT_STEP":
            return "feedback"

        return step

    # -- renderers ----------------------------------------------------------- #
    def _render(self, step: str, sid: str, session: Dict[str, Any]) -> FlowStepResponse:
        data = session["data"]

        if step == "initial_prompt":
            return FlowStepResponse(
                session_id=sid,
                step_id=step,
                screen_title="Chat with Ranjan Sir",
                components=[
                    _comp("HeroHeader", title="Chat with Ranjan Sir",
                          subtitle="Ask anything about your syllabus, concepts, exam prep, or study plan.",
                          icon="smart_toy"),
                    _comp("PromptInput", placeholder="Ask a question or type a message..."),
                    _comp("ChatStarters", options=[
                        {"label": "Review Class 10 Math syllabus", "icon": "menu_book", "primary": False},
                        {"label": "Explain Ohm's Law derivation", "icon": "bolt", "primary": False},
                        {"label": "What Should I Do Today?", "icon": "task_alt", "primary": True},
                    ]),
                ],
                can_go_back=False,
            )

        if step == "answer":
            result = engine.answer(str(data.get("query", "")))
            return FlowStepResponse(
                session_id=sid,
                step_id=step,
                screen_title="Ranjan Sir's Response",
                components=[
                    _comp("AnswerCard", answer=result.answer, sources=result.sources),
                    _comp("ActionButtons", buttons=[
                        {"label": "What should I do today?", "action_type": "SUBMIT_QUERY",
                         "payload": {"query": "what to do today"}, "variant": "emerald"},
                        {"label": "Ask another question", "action_type": "RESET", "payload": {}, "variant": "outline"},
                    ]),
                ],
                can_go_back=True,
            )

        if step == "triage_1":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Step 1 · Heavy Coaching Schedule",
                components=[
                    _comp("CoachingLoadPreview", days=COACHING_LOAD),
                    _comp("GuidedStepCard",
                          headline="Long Wednesday today. You've had your heaviest coaching schedule.",
                          primary={"label": "Continue", "action_type": "NEXT_STEP", "payload": {}}),
                ],
                can_go_back=True,
            )

        if step == "triage_2":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Step 2 · Capacity Triage",
                components=[
                    _comp("GuidedStepCard",
                          chip="Capacity Triage Detected: -35% Study Energy",
                          headline="I've already kept tonight lighter. You usually have less useful study capacity after Wednesdays like this.",
                          primary={"label": "See what matters tonight", "action_type": "NEXT_STEP", "payload": {}}),
                ],
                can_go_back=True,
            )

        if step == "triage_3":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Step 3 · Protecting the Week",
                components=[
                    _comp("GuidedStepCard",
                          eyebrow="PHASE 02 • SUSTAINABILITY RULE",
                          headline="Tonight isn't about clearing backlog. We're protecting the week.",
                          primary={"label": "Show me how", "action_type": "NEXT_STEP", "payload": {}}),
                ],
                can_go_back=True,
            )

        if step == "triage_4":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Step 4 · Subject Selection",
                components=[
                    _comp("SubjectSelector",
                          heading="TODAY'S PRIORITIES",
                          title="Which subject do we start with?",
                          subtitle="I'd suggest Physics first — it's currently blocking today's class.",
                          subjects=SUBJECTS),
                ],
                can_go_back=True,
            )

        if step == "triage_5":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Step 5 · Physics Dependency",
                components=[
                    _comp("GuidedStepCard",
                          eyebrow="DEPENDENCY IDENTIFIED",
                          headline="First: Physics. NLM is currently blocking part of today's Rotational Mechanics.",
                          primary={"label": "What do we do?", "action_type": "NEXT_STEP", "payload": {}}),
                ],
                can_go_back=True,
            )

        if step == "triage_6":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Step 6 · 20-Min NLM Bridge",
                components=[
                    _comp("GuidedStepCard",
                          eyebrow="PREREQUISITE BRIDGE",
                          headline="We're not finishing NLM tonight. We only need enough NLM to unblock Rotational Mechanics. 20 minutes.",
                          primary={"label": "Start NLM Bridge", "action_type": "NEXT_STEP", "payload": {}}),
                ],
                can_go_back=True,
            )

        if step == "quest_roadmap":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Today's Quest Route & Adaptive Path",
                components=[
                    _comp("QuestTimeline",
                          title="Today's Guided Quest: Rotational Mechanics Unblock Flow",
                          subtitle="Adaptive progression path calibrated on your 20-min NLM Bridge triage.",
                          stages=QUEST_STAGES),
                ],
                can_go_back=True,
            )

        if step == "quest_hub":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Connected Flow & Quest Discussion",
                components=[
                    _comp("HeroHeader", title="Quest Connected", icon="psychology",
                          subtitle="Your 4-stage adaptive quest has been locked in. Ask Ranjan Sir anything or start directly."),
                    _comp("PromptInput", placeholder="Ask a question about today's quest or derivations..."),
                    _comp("ActionButtons", buttons=[
                        {"label": "Start Quest", "action_type": "SELECT_OPTION",
                         "payload": {"start_quest": True}, "variant": "dark"},
                    ]),
                ],
                can_go_back=True,
            )

        if step == "day_wrap":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Intelligent Day Wrap",
                components=[
                    _comp("HeroHeader", title="Session 01 Wrap-up", icon="verified",
                          subtitle="Workload protected within your 45-minute cognitive threshold."),
                    _comp("MetricCard", icon="schedule", iconTone="slate", title="Cognitive Bandwidth",
                          subtitle="42m / 45m allotted", big="42", unit="mins", badge="3m safety delta",
                          footerLeft="Threshold Respected", footerRight="Session Complete"),
                    _comp("MetricCard", icon="speed", iconTone="emerald", title="Efficiency Ratio",
                          subtitle="Single-tasking maintained", big="94.8", unit="%", badge="+6% vs Mon",
                          footerLeft="No cognitive spillover", footerRight="Stable"),
                    _comp("ActionButtons", buttons=[
                        {"label": "Conclude for Today", "action_type": "NEXT_STEP", "payload": {}, "variant": "dark"},
                    ]),
                ],
                can_go_back=True,
            )

        if step == "feedback":
            return FlowStepResponse(
                session_id=sid, step_id=step, screen_title="Feedback Summary",
                components=[
                    _comp("HeroHeader", title="Everything necessary is completed.", icon="nightlight",
                          subtitle="Rest tonight is not lost time — it consolidates the neural pathways built today."),
                    _comp("ActionButtons", buttons=[
                        {"label": "Start over", "action_type": "RESET", "payload": {}, "variant": "outline"},
                    ]),
                ],
                can_go_back=False,
                is_complete=True,
            )

        # Unknown step → reset to initial prompt.
        return self._render("initial_prompt", sid, session)
