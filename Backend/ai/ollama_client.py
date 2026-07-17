import requests


class OllamaClient:

    def __init__(self):

        self.url = "http://localhost:11434/api/generate"

        self.model = "qwen2.5-coder:3b"

    def generate(self, prompt):

        payload = {

            "model": self.model,

            "prompt": prompt,

            "stream": False

        }

        response = requests.post(
            self.url,
            json=payload
        )

        return response.json()["response"]