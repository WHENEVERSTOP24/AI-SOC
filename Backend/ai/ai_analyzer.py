from ai.response_parser import ResponseParser
from ai.ollama_client import OllamaClient


class AIAnalyzer:

    def __init__(self):

        self.client = OllamaClient()
        self.parser = ResponseParser()
    def analyze(self, report, prompt_builder):

        prompt = prompt_builder.build(report)

        response = self.client.generate(prompt)

        parsed = self.parser.parse(response)

        return parsed