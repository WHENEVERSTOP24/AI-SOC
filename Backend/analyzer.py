import requests

prompt = """
You are a SOC Analyst.

Analyze the following event:

Event Type: Network Connection
Severity: Medium

Provide:
1. Threat Summary
2. Possible MITRE ATT&CK Technique
3. Recommended Actions

Keep response under 100 words.
"""

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "qwen2.5-coder:3b",
        "prompt": prompt,
        "stream": False
    }
)

print(response.json()["response"])