from ai.response_parser import ResponseParser
from ai.ollama_client import OllamaClient


class AIAnalyzer:

    def __init__(self):

        self.client = OllamaClient()
        self.parser = ResponseParser()

    def analyze(self, report, prompt_builder):

        prompt = prompt_builder.build(report)

        try:
            response = self.client.generate(prompt)
            parsed = self.parser.parse(response)
            return parsed

        except ConnectionError:
            return self._fallback_response("Ollama is not running. Please start Ollama and try again.")
        except Exception as exc:
            return self._fallback_response(f"AI analysis failed: {str(exc)}")

    def _fallback_response(self, message: str) -> dict:
        """Return a safe fallback when AI analysis is unavailable."""
        return {
            "summary": message,
            "severity_reasoning": "AI analysis unavailable.",
            "impact": "Unknown.",
            "attacker_next_step": "Unknown.",
            "containment": ["AI analysis unavailable. Manual investigation required."],
            "investigation": ["Review logs manually."],
            "confidence": "Low",
        }