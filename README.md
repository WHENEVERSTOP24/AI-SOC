# 🛡️ AI-SOC
### AI-Powered Security Operations Center for Intelligent Threat Detection & Incident Response

> A modern Security Operations Center (SOC) platform that combines real-time detection, MITRE ATT&CK mapping, incident correlation, and Large Language Models (LLMs) to help security analysts investigate threats faster.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 🚀 Overview

AI-SOC is an AI-assisted Security Operations Center designed to simulate how modern SOC teams detect, investigate, and respond to cyber threats.

Instead of simply displaying alerts, AI-SOC correlates security events into incidents, maps them to the MITRE ATT&CK framework, and generates analyst-friendly explanations using a locally hosted Large Language Model (Ollama).

The project demonstrates how Artificial Intelligence can improve Security Operations by reducing investigation time and helping analysts understand threats faster.
Website link - https://ai-soc-tau.vercel.app/
---

# ✨ Features

## 📊 SOC Dashboard

- Live security dashboard
- Risk Gauge
- Active alerts
- Open incidents
- MITRE ATT&CK coverage
- Security statistics

---

## 🚨 Threat Detection

Detects suspicious activities including:

- PowerShell Abuse
- RunDLL32 Execution
- CertUtil Download
- Scheduled Task Abuse
- LOLBins
- Command Execution
- Additional custom detection rules

---

## 🤖 AI Threat Analysis

Powered by **Ollama**

For every alert AI-SOC generates:

- Executive Summary
- Threat Explanation
- Technical Analysis
- MITRE ATT&CK Mapping
- Recommended Mitigation
- Risk Assessment

---

## 🔗 Incident Correlation

Automatically groups related alerts into security incidents using:

- Host correlation
- User correlation
- Temporal correlation
- Process relationships

---

## 🕸 Investigation Graph

Visual graph showing:

Host

↓

Processes

↓

Alerts

↓

MITRE Techniques

Helping analysts understand attack progression visually.

---

## 📖 Incident Timeline

Chronological timeline of attack events including:

- Detection timestamps
- Alert creation
- AI analysis
- Correlation events

---

## 🎯 MITRE ATT&CK Integration

Each alert is mapped to:

- Technique ID
- Technique Name
- Attack Tactic

Providing standardized threat intelligence.

---

## ⚔ Attack Simulator

Built-in simulator capable of generating realistic attack scenarios including:

- PowerShell Attack
- RunDLL32 Abuse
- CertUtil Download
- Scheduled Task Persistence

Used for testing the detection pipeline without requiring malware.

---

# 🏗 Architecture

```
                Windows Sysmon
                      │
                      ▼
             Event Normalization
                      │
                      ▼
             Detection Engine
                      │
                      ▼
             Alert Manager
                      │
                      ▼
          Incident Correlation Engine
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   MITRE ATT&CK Mapping      AI Analysis
                                  │
                              Ollama LLM
                                  │
                                  ▼
                          Security Explanation
                                  │
                                  ▼
                        React Dashboard (Frontend)
```

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Axios
- React Router

---

## Backend

- FastAPI
- Python
- Uvicorn

---

## AI

- Ollama
- Local LLM

---

## Detection

- Windows Sysmon
- Custom Detection Rules
- MITRE ATT&CK Mapping

---

# 📸 Screenshots

## Dashboard

> *(Add Screenshot)*

---

## Alerts

> *(Add Screenshot)*

---

## AI Analysis

> *(Add Screenshot)*

---

## Investigation Graph

> *(Add Screenshot)*

---

## Attack Simulator

> *(Add Screenshot)*

---

# ⚙ Installation

## Clone

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

Backend runs on

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

Frontend runs on

```
http://localhost:5173
```

---

# AI Requirements

Install Ollama

Download a supported model

Example:

```
ollama pull qwen2.5:3b
```

Start Ollama before running AI-SOC.

---

# Folder Structure

```
AI-SOC

├── Backend
│
├── Frontend
│
├── README.md
│
└── screenshots
```

---

# Future Improvements

- WebSocket live updates
- Multi-host monitoring
- Sigma rule support
- YARA integration
- Threat Intelligence feeds
- SIEM integrations
- Multi-user authentication
- Cloud deployment

---

# Research Direction

This project also serves as the foundation for future research exploring:

> **Can AI-generated, analyst-friendly security explanations reduce investigation time and improve attack mitigation compared to traditional SOC alerts?**

The research will evaluate:

- Investigation speed
- Analyst comprehension
- Alert prioritization
- Human-AI collaboration
- SOC efficiency

---

# Author

**Anubhav Rajput**

Computer Science (Cybersecurity)

AI Security • SOC Engineering • Offensive Security

GitHub:
https://github.com/YOUR_USERNAME

LinkedIn:
YOUR_LINKEDIN

---

# License

MIT License
