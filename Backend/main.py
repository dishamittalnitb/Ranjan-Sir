"""Ranjan Sir Mentor API — HTTP layer.

Thin FastAPI wiring over the answering engine (``engine.py``) and the backend-driven
UI flow state machine (``flow.py``). Business logic lives in those modules.
"""
from __future__ import annotations

import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import engine
from flow import FlowEngine
from schemas import (
    AnswerRequest,
    AnswerResponse,
    FlowActionRequest,
    FlowStepResponse,
    StudentProfile,
)

app = FastAPI(title="Ranjan Sir Mentor API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

flow_engine = FlowEngine()


@app.get("/health")
def health() -> dict[str, object]:
    return {"status": "ok", "gemini": bool(engine.GOOGLE_API_KEY), "model": engine.GEMINI_MODEL}


@app.get("/api/student", response_model=StudentProfile)
def student() -> StudentProfile:
    return engine.load_student()


@app.post("/api/answer", response_model=AnswerResponse)
def answer(request: AnswerRequest) -> AnswerResponse:
    response = engine.answer(request.query)
    response.session_id = request.session_id or uuid.uuid4().hex
    return response


@app.post("/api/flow/action", response_model=FlowStepResponse)
def flow_action(request: FlowActionRequest) -> FlowStepResponse:
    return flow_engine.handle(request)
