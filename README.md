# 🛡️ AI-SOC
### AI-Powered Security Operations Center with Local LLM Integration

AI-SOC is an intelligent Security Operations Center (SOC) platform that detects, correlates, investigates, and explains security events collected from Microsoft Sysmon logs.

Unlike traditional dashboards, AI-SOC combines rule-based detection, incident correlation, MITRE ATT&CK mapping, investigation timelines, attack narratives, and local Large Language Models (LLMs) to provide analyst-friendly security investigations.

---

# 🚀 Features

- Real-time Sysmon log analysis
- Rule-based threat detection
- Risk scoring engine
- Incident correlation engine
- Investigation Graph
- MITRE ATT&CK Mapping
- Timeline Builder
- Attack Narrative Generation
- AI-generated SOC summaries
- Built-in Attack Simulator
- Interactive Dashboard
- Investigation Reports

---

# 🏗 Architecture

```
                Windows Sysmon
                      │
                      ▼
              Event Parser
                      │
                      ▼
            Event Normalizer
                      │
                      ▼
           Detection Engine
                      │
                      ▼
              Risk Engine
                      │
                      ▼
            Alert Management
                      │
                      ▼
         Correlation Engine
                      │
                      ▼
        Investigation Builder
      ┌──────────────┼──────────────┐
      │              │              │
Timeline      MITRE Mapping   Recommendations
      │              │              │
      └──────────────┼──────────────┘
                     ▼
              AI Explanation
             (Local Ollama)
```

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- FastAPI
- Python
- Uvicorn

## AI

- Ollama
- Llama 3 / Mistral / Any Local Model

## Security

- Microsoft Sysmon
- MITRE ATT&CK Framework

---

# 🤖 AI Analysis

AI-SOC performs AI-powered investigation summaries using **Ollama running locally**.

The LLM receives:

- Investigation Timeline
- Detected Techniques
- Alert Severity
- Incident Context
- MITRE ATT&CK Mapping

and produces:

- Executive Summary
- Technical Analysis
- Risk Explanation
- Mitigation Recommendations

---

# ⚠ Deployment Note

The public deployment demonstrates the complete AI-SOC platform including:

- Dashboard
- Alerts
- Incidents
- Investigation
- Attack Simulator
- Incident Correlation
- MITRE Mapping

However, **AI Analysis is intentionally disabled in the cloud deployment.**

The AI engine depends on a locally running Ollama instance and therefore only functions in the local development environment.

This design preserves privacy while avoiding cloud-hosted LLM costs.

---

# 🌐 Live Demo

## Frontend

https://ai-soc-tau.vercel.app

## Backend API

https://ai-soc-dbym.onrender.com

Swagger Documentation

https://ai-soc-dbym.onrender.com/docs

---

# 📦 Local Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-SOC.git
cd AI-SOC
```

---

## Backend

```bash
cd Backend

pip install -r requirements.txt

python -m uvicorn api:app --reload
```

Backend runs at

```
http://localhost:8000
```

---

## Frontend

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🤖 Running AI Analysis

Install Ollama

https://ollama.com/

Pull a model

```bash
ollama pull llama3
```

or

```bash
ollama pull mistral
```

Start Ollama

```bash
ollama serve
```

AI-SOC will automatically connect to the local Ollama server for investigation summaries.

---

# 🎯 Supported Detection Rules

- PowerShell Execution
- Encoded PowerShell
- CMD Execution
- WMIC Abuse
- CertUtil Download
- MSHTA Execution
- Rundll32 Abuse
- Regsvr32 Abuse
- Suspicious Network Connections
- File Creation Events

---

# 🧪 Built-in Attack Simulator

AI-SOC includes a safe attack simulator for testing detection rules.

Supported simulations:

- PowerShell
- Encoded PowerShell
- CMD
- CertUtil
- WMIC
- MSHTA
- Rundll32
- Regsvr32

---

# 📈 Investigation Features

- Incident Timeline
- Attack Story
- Detection Summary
- MITRE ATT&CK Mapping
- Risk Score
- Recommendations
- AI Summary

---

# 📚 Future Work

- Multi-host monitoring
- Wazuh integration
- Sigma rule support
- YARA scanning
- SOAR playbooks
- VirusTotal integration
- Threat Intelligence feeds
- Multi-agent AI investigations

---

# 👨‍💻 Author

**Anubhav Rajput**

Computer Science (Cybersecurity)

IILM University

GitHub:
https://github.com/YOUR_USERNAME

LinkedIn:
https://linkedin.com/in/YOUR_LINKEDIN

---

# 📄 License

MIT License
