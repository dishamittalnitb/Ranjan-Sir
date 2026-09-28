"""Dynamic flow + answer schemas (single source of truth for the HTTP contract)."""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# --------------------------------------------------------------------------- #
# Mentor answer API                                                            #
# --------------------------------------------------------------------------- #
class AnswerRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Student question or request.")
    session_id: Optional[str] = Field(None, description="Optional conversation id.")


class AnswerResponse(BaseModel):
    answer: str
    session_id: Optional[str] = None
    sources: List[str] = Field(default_factory=list)


class StudentProfile(BaseModel):
    fullName: str
    shortName: str
    enrollmentId: str
    tier: str
    bio: str
    boardGrade: str
    school: str
    examTarget: str
    cognitiveCap: str
    priorityDisciplines: List[str]


# --------------------------------------------------------------------------- #
# Backend-driven UI flow                                                       #
# --------------------------------------------------------------------------- #
class UIComponentSchema(BaseModel):
    type: str  # e.g. "HeroHeader", "PromptInput", "AnswerCard", "ActionButtons", "MetricCard"
    props: Dict[str, Any] = Field(default_factory=dict)


class FlowStepResponse(BaseModel):
    session_id: str
    step_id: str
    screen_title: Optional[str] = None
    components: List[UIComponentSchema] = Field(default_factory=list)
    context_data: Dict[str, Any] = Field(default_factory=dict)
    can_go_back: bool = False
    is_complete: bool = False


class FlowActionRequest(BaseModel):
    session_id: Optional[str] = None
    step_id: str
    action_type: str  # e.g. "SUBMIT_QUERY", "SELECT_OPTION", "RETRY", "NEXT_STEP"
    payload: Dict[str, Any] = Field(default_factory=dict)
