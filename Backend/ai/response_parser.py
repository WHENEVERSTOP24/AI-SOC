"""AI-SOC Response Parser

Parses raw LLM responses into structured analysis objects.
Supports multiple schema versions for backward compatibility.
"""

import json
import re
from typing import Any


class ResponseParser:
    """Parses raw LLM responses into structured analysis dicts."""

    def parse(self, raw_response: str) -> dict[str, Any]:
        """Parse an LLM response into a structured analysis result."""
        try:
            cleaned = raw_response.strip()
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.MULTILINE)
            cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE)
            cleaned = cleaned.strip()
            parsed = json.loads(cleaned)
            return self._validate_and_fill(parsed)
        except (json.JSONDecodeError, ValueError, TypeError):
            return self._fallback(raw_response)

    def _validate_and_fill(self, parsed: dict) -> dict[str, Any]:
        """Ensure the parsed response has all required fields with defaults."""
        return {
            "summary": parsed.get("summary", "Analysis summary not available."),
            "confidence": self._normalize_confidence(parsed.get("confidence", 75)),
            "severity": self._normalize_severity(parsed.get("severity", parsed.get("severity_reasoning", "Medium"))),
            "mitre": parsed.get("mitre", parsed.get("mitre_technique", "")),
            "reasoning": parsed.get("reasoning", parsed.get("severity_reasoning", "")),
            "recommended_actions": self._normalize_actions(
                parsed.get("recommended_actions", parsed.get("containment", parsed.get("investigation", [])))
            ),
            "false_positive_probability": self._normalize_fp(parsed.get("false_positive_probability", "Medium")),
        }

    def _normalize_confidence(self, value: Any) -> int:
        if isinstance(value, (int, float)):
            return max(0, min(100, int(value)))
        if isinstance(value, str):
            mapping = {"high": 95, "medium": 80, "low": 60, "very high": 98, "very low": 30}
            return mapping.get(value.strip().lower(), 75)
        return 75

    def _normalize_severity(self, value: str) -> str:
        mapping = {"critical": "Critical", "high": "High", "medium": "Medium",
                   "low": "Low", "info": "Info", "informational": "Info"}
        return mapping.get(value.strip().lower(), "Medium")

    def _normalize_actions(self, value: Any) -> list[str]:
        if isinstance(value, list):
            return [str(item) for item in value if item]
        if isinstance(value, str):
            return [value]
        return ["Review the alert details and investigate further."]

    def _normalize_fp(self, value: str) -> str:
        valid = ["Very Low", "Low", "Medium", "High", "Very High"]
        for v in valid:
            if value.strip().lower() == v.lower():
                return v
        return "Medium"

    def _fallback(self, raw: str) -> dict[str, Any]:
        return {
            "summary": "AI analysis encountered an error. The raw response is shown below.",
            "confidence": 0,
            "severity": "Medium",
            "mitre": "",
            "reasoning": raw[:500] if raw else "No response from AI model.",
            "recommended_actions": ["Retry analysis or check Ollama connection."],
            "false_positive_probability": "Medium",
        }