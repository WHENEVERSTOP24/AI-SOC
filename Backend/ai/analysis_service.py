"""AI-SOC Analysis Service

Orchestrates the full analysis pipeline for a single alert:
  1. Build structured prompt from alert data
  2. Send to Ollama local LLM
  3. Parse and validate response
  4. Return structured analysis
"""

from ai.prompt_builder import AlertPromptBuilder
from ai.ollama_client import OllamaClient
from ai.response_parser import ResponseParser


class AnalysisService:
    """Service for analyzing individual alerts using the local LLM."""

    def __init__(self):
        self.prompt_builder = AlertPromptBuilder()
        self.ollama_client = OllamaClient()
        self.parser = ResponseParser()

    def analyze_alert(self, alert: dict) -> dict:
        """
        Analyze a single alert through the full pipeline.

        Args:
            alert: Alert dictionary with keys like id, rule_name, severity,
                   host, user, process_name, command_line, description, etc.

        Returns:
            Dict with keys: summary, confidence, severity, mitre, reasoning,
                            recommended_actions, false_positive_probability
        """
        try:
            prompt = self.prompt_builder.build(alert)
            raw_response = self.ollama_client.generate(prompt)
            return self.parser.parse(raw_response)

        except ConnectionError:
            return self._offline_response("Ollama is not running. Please start Ollama and try again.")

        except Exception as exc:
            return self._offline_response(f"Analysis failed: {str(exc)}")

    def _offline_response(self, message: str) -> dict:
        """Return a safe response when Ollama is unavailable."""
        return {
            "summary": message,
            "confidence": 0,
            "severity": "Medium",
            "mitre": "",
            "reasoning": "The AI analysis engine is currently unavailable. Please verify that Ollama is installed and running (ollama serve).",
            "recommended_actions": [
                "Ensure Ollama is installed (https://ollama.ai)",
                "Run 'ollama serve' to start the service",
                "Run 'ollama pull qwen2.5-coder:3b' to download the model",
                "Click Retry to attempt analysis again"
            ],
            "false_positive_probability": "Medium",
        }
