"""Ranjan Sir answering engine.

Retrieves ground-truth content from the wiki + student OS and produces mentor answers,
using Gemini when ``GOOGLE_API_KEY`` is set and falling back to deterministic retrieval.
"""
from __future__ import annotations

import os
import re
from pathlib import Path
from typing import List, Optional

import yaml

from schemas import AnswerResponse, StudentProfile

# --------------------------------------------------------------------------- #
# Paths                                                                        #
# --------------------------------------------------------------------------- #
BASE_DIR = Path(__file__).resolve().parent
SYLLABUS_GRAPH = BASE_DIR / "School_Master_Wiki" / "02_Syllabus_Graph"
STUDENT_DIR = BASE_DIR / "Student_OS_Arjun_Class10"
MENTOR_PROMPT = BASE_DIR / "PROMPTS" / "ranjanSir.md"


def _load_dotenv() -> None:
    env_path = BASE_DIR / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()


# --------------------------------------------------------------------------- #
# Knowledge index (deterministic; the mentor NEVER invents content)            #
# --------------------------------------------------------------------------- #
TOPIC_INDEX: dict[str, str] = {
    # Science
    "electricity": "SCI_Ch25_Electricity.md",
    "ohm": "SCI_Ch25_Electricity.md",
    "circuit": "SCI_Ch25_Electricity.md",
    "current": "SCI_Ch25_Electricity.md",
    "resistance": "SCI_Ch25_Electricity.md",
    "newton": "SCI_Ch09_Force_and_Newtons_Laws.md",
    "nlm": "SCI_Ch09_Force_and_Newtons_Laws.md",
    "force": "SCI_Ch09_Force_and_Newtons_Laws.md",
    "motion": "SCI_Ch08_Motion.md",
    "gravitation": "SCI_Ch10_Gravitation.md",
    "gravity": "SCI_Ch10_Gravitation.md",
    "work": "SCI_Ch12_Work_Energy_and_Power.md",
    "energy": "SCI_Ch12_Work_Energy_and_Power.md",
    "power": "SCI_Ch12_Work_Energy_and_Power.md",
    "light": "SCI_Ch23_Light_Reflection_and_Refraction.md",
    "refraction": "SCI_Ch23_Light_Reflection_and_Refraction.md",
    "reflection": "SCI_Ch23_Light_Reflection_and_Refraction.md",
    "reaction": "SCI_Ch15_Chemical_Reactions_and_Equations.md",
    "equation": "SCI_Ch15_Chemical_Reactions_and_Equations.md",
    "acid": "SCI_Ch16_Acids_Bases_and_Salts.md",
    "base": "SCI_Ch16_Acids_Bases_and_Salts.md",
    "salt": "SCI_Ch16_Acids_Bases_and_Salts.md",
    "reproduction": "SCI_Ch21_Reproduction.md",
    "heredity": "SCI_Ch22_Heredity_and_Evolution.md",
    "magnet": "SCI_Ch26_Magnetic_Effects_of_Current.md",
    # Maths
    "quadratic": "MATH_Ch27_Quadratic_Equations.md",
    "trigonometry": "MATH_Ch32_Introduction_to_Trigonometry.md",
    "trig": "MATH_Ch32_Introduction_to_Trigonometry.md",
    "triangle": "MATH_Ch30_Triangles.md",
    "circle": "MATH_Ch31_Circles.md",
    "probability": "MATH_Ch38_Probability.md",
    "statistics": "MATH_Ch37_Statistics.md",
    "linear": "MATH_Ch26_Pair_of_Linear_Equations_in_Two_Variables.md",
    "progression": "MATH_Ch28_Arithmetic_Progressions.md",
    "polynomial": "MATH_Ch25_Polynomials.md",
    "real": "MATH_Ch24_Real_Numbers.md",
    "mensuration": "MATH_Ch36_Surface_Areas_and_Volumes.md",
    "height": "MATH_Ch34_Heights_and_Distances.md",
    # Social Science
    "french": "SST_Ch01_The_French_Revolution.md",
    "nationalism": "SST_Ch21_The_Rise_of_Nationalism_in_Europe.md",
    "democracy": "SST_Ch12_What_is_Democracy_Why_Democracy.md",
    "agriculture": "SST_Ch29_Agriculture.md",
    "money": "SST_Ch40_Money_and_Credit.md",
}


STOPWORDS = {
    "the", "and", "for", "are", "how", "what", "do", "to", "of", "in", "is",
    "with", "from", "that", "this", "you", "was", "were", "into", "not", "his",
}


def _tokenize(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", text.lower()) if len(t) >= 2 and t not in STOPWORDS}


def _read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""


# --------------------------------------------------------------------------- #
# Student OS (Arjun)                                                           #
# --------------------------------------------------------------------------- #
def _read_frontmatter(path: Path) -> dict:
    if not path.exists():
        return {}
    text = _read_text(path)
    if not text.startswith("---"):
        return {}
    try:
        _, frontmatter, _ = text.split("---", 2)
    except ValueError:
        return {}
    data = yaml.safe_load(frontmatter) or {}
    return data if isinstance(data, dict) else {}


def load_student() -> StudentProfile:
    raw = _read_frontmatter(STUDENT_DIR / "student_index.md")
    return StudentProfile(
        fullName=raw.get("full_name", ""),
        shortName=raw.get("short_name", ""),
        enrollmentId=raw.get("enrollment_id", ""),
        tier=raw.get("tier", ""),
        bio=raw.get("bio", ""),
        boardGrade=f"{raw.get('board', '')} — {raw.get('grade', '')}",
        school=raw.get("school", ""),
        examTarget=raw.get("exam_target", ""),
        cognitiveCap=raw.get("cognitive_cap", ""),
        priorityDisciplines=[str(d) for d in raw.get("priority_disciplines", [])],
    )


def load_weak_concepts() -> List[dict]:
    path = STUDENT_DIR / "01_Knowledge_State" / "Weak_Concepts.md"
    if not path.exists():
        return []
    rows: List[dict] = []
    for line in _read_text(path).splitlines():
        if not line.strip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 6 or cells[0] in ("", "Date Flagged", "Subject"):
            continue
        if set(cells[0]) <= set("-: "):
            continue
        rows.append({"chapter": cells[2], "topic": cells[3], "severity": cells[4]})
    return rows


MENTOR_SYSTEM_PROMPT = (
    "You are \"Ranjan Sir\", the personal CBSE Class 10 execution mentor for Arjun Sharma. "
    "You are firm but highly encouraging and use the Socratic method.\n\n"
    "RULES:\n"
    "- Answer ONLY from the ground-truth context provided. Never invent syllabus, marks, PYQ, or step-marking details.\n"
    "- Cite the chapter reference (e.g. SCI_Ch25_Electricity.md) whenever you use its content.\n"
    "- Guide the student to the relevant concept or formula instead of handing over the answer.\n"
    "- Protect the sleep boundary: curfew is 22:30 IST and daily cognitive cap is 45-60 minutes.\n"
    "- Surface the student's flagged weak concepts when relevant.\n"
    "- Keep responses concise and board-exam focused."
)


# --------------------------------------------------------------------------- #
# Retrieval (RAG)                                                              #
# --------------------------------------------------------------------------- #
def find_chapters(query: str) -> List[Path]:
    tokens = _tokenize(query)

    direct = [TOPIC_INDEX[tok] for tok in tokens if tok in TOPIC_INDEX]
    direct_unique: List[str] = list(dict.fromkeys(direct))

    scored: List[tuple[int, Path]] = []
    if SYLLABUS_GRAPH.exists():
        for file in SYLLABUS_GRAPH.glob("*.md"):
            score = len(tokens & _tokenize(file.stem))
            if score > 0:
                scored.append((score, file))
        scored.sort(key=lambda item: -item[0])

    paths: List[Path] = []
    for stem in direct_unique:
        paths.append(SYLLABUS_GRAPH / stem)
    paths.extend(file for _, file in scored if file not in paths)
    return paths[:3]


def chapter_summary(path: Path, limit: int = 4) -> str:
    text = re.sub(r"^---.*?---", "", _read_text(path), flags=re.DOTALL)
    bullets: List[str] = []
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith(("- ", "* ")) and not stripped.startswith("---"):
            bullets.append(stripped.lstrip("-* ").strip())
    if not bullets:
        bullets = [ln.strip() for ln in text.splitlines() if ln.strip() and not ln.lstrip().startswith("#")][:limit]
    return " ".join(bullets[:limit])


def chapter_content(path: Path, max_chars: int = 2500) -> str:
    text = re.sub(r"^---.*?---", "", _read_text(path), flags=re.DOTALL).strip()
    return text[:max_chars]


# --------------------------------------------------------------------------- #
# Gemini generation                                                            #
# --------------------------------------------------------------------------- #
def gemini_answer(query: str, chapters: List[Path]) -> Optional[str]:
    if not GOOGLE_API_KEY:
        return None
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        return None

    student = load_student()
    parts: List[str] = [
        f"Student: {student.fullName} — {student.boardGrade}, {student.school}",
        f"Exam target: {student.examTarget}",
        f"Daily cognitive cap: {student.cognitiveCap}",
    ]
    for chapter in chapters:
        parts.append(f"--- Chapter {chapter.name} ---\n{chapter_content(chapter)}")
    weak = _read_text(STUDENT_DIR / "01_Knowledge_State" / "Weak_Concepts.md").strip()
    if weak:
        parts.append(f"--- Student weak concepts ---\n{weak}")

    user_message = (
        f"Student query: {query}\n\n"
        f"Ground-truth context (answer strictly from this and cite the chapter names):\n\n"
        f"{chr(10).join(parts)}"
    )

    try:
        client = genai.Client(
            api_key=GOOGLE_API_KEY,
            http_options=types.HttpOptions(timeout=60_000),
        )
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=user_message,
            config=types.GenerateContentConfig(
                system_instruction=MENTOR_SYSTEM_PROMPT,
                temperature=0.4,
                max_output_tokens=1024,
            ),
        )
        text = (response.text or "").strip()
        return text or None
    except Exception:
        return None


# --------------------------------------------------------------------------- #
# Public answer entrypoint                                                     #
# --------------------------------------------------------------------------- #
def answer(query: str) -> AnswerResponse:
    chapters = find_chapters(query)
    source_names = [c.name for c in chapters]

    gemini_text = gemini_answer(query, chapters)
    if gemini_text:
        return AnswerResponse(answer=gemini_text, sources=source_names)

    if not chapters:
        text = (
            "Before I answer, point me to the right place. Which subject are you on — "
            "Science, Maths, English, or Social Science — and which chapter or topic? "
            "I'll pull the exact Concept Summary from the wiki and we'll work from there."
        )
        return AnswerResponse(answer=text, sources=[])

    summaries = [s for s in (chapter_summary(c) for c in chapters) if s]

    if not summaries:
        text = (
            f"I found the relevant chapter ({source_names[0]}), but I want you to open the "
            f"Concept Summary there. Tell me which definition or formula looks confusing and "
            f"we'll break it down step by step."
        )
        return AnswerResponse(answer=text, sources=source_names)

    text = (
        f"Here's what matters for that. {summaries[0]}\n\n"
        f"Start with the Concept Summary and formulas, then tell me which step you want to "
        f"work through next — I'll guide you Socratic-style rather than hand you the answer."
    )

    tokens = _tokenize(query)
    source_tokens: set[str] = set()
    for name in source_names:
        source_tokens |= _tokenize(name)
    for weak in load_weak_concepts():
        weak_tokens = _tokenize(f"{weak['chapter']} {weak['topic']}")
        if tokens & weak_tokens or source_tokens & weak_tokens:
            text += (
                f"\n\nHeads-up: this connects to your flagged weakness — {weak['topic']}. "
                f"Let's make sure we close that gap properly here."
            )
            break

    return AnswerResponse(answer=text, sources=source_names)
