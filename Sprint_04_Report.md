# Sprint 04 — AI Investigation Engine

**Date:** July 16, 2026
**Status:** ✅ Complete
**Build:** ✅ Passes (`npm run build` — zero TypeScript errors)

---

## AI Architecture Overview

### Request Flow

```
User clicks "Analyze" on alert in AlertTable
  → frontend/src/hooks/useAnalysis.ts
    → POST /api/analyze/alert (sends full alert object)
      → Backend/api.py receives request
        → Backend/ai/analysis_service.py orchestrates:
          1. prompt_builder.py builds structured LLM prompt
          2. ollama_client.py sends to local Ollama (qwen2.5-coder:3b)
          3. response_parser.py extracts structured JSON
        → Returns { summary, confidence, severity, mitre, reasoning,
                    recommended_actions, false_positive_probability }
    → useAnalysis.ts receives result
    → Cached in localStorage for history
    → Displayed in AIAnalysisPanel component
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                     │
│                                                       │
│  Alerts.tsx                                           │
│  ├── AlertTable (with Analyze buttons)                │
│  ├── AlertCard (Telemetry Inspector)                  │
│  └── AIAnalysisPanel                                  │
│        ├── Summary + Confidence Ring                  │
│        ├── MITRE Badge + FP Probability               │
│        ├── Reasoning section                          │
│        ├── Recommended Actions                        │
│        └── History sidebar (localStorage cache)       │
│                                                       │
│  useAnalysis.ts hook                                  │
│  ├── analyze(alert) → POST /analyze/alert             │
│  ├── loading / error / result states                  │
│  ├── localStorage caching (20 entries max)            │
│  └── retry capability                                 │
└─────────────────────┬─────────────────────────────────┘
                      │ POST /analyze/alert
                      ▼
┌─────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                     │
│                                                       │
│  api.py                                               │
│  └── POST /analyze/alert endpoint                    │
│       └── analysis_service.py                         │
│            ├── prompt_builder.py (structured prompt)  │
│            ├── ollama_client.py (HTTP → Ollama)       │
│            └── response_parser.py (JSON parsing)      │
│                                                       │
│  Ollama (local) → qwen2.5-coder:3b                    │
└─────────────────────────────────────────────────────┘
```

---

## New Files Created (5)

| File | Purpose |
|---|---|
| `Backend/ai/prompt_builder.py` | Builds structured LLM prompts from alert data. Includes alert details (name, severity, status, timestamp), source context (host, user, process, command line), MITRE mapping, description, and system role context. Instructs LLM to return structured JSON. |
| `Backend/ai/analysis_service.py` | Orchestrates the full analysis pipeline: builds prompt, sends to Ollama, parses response. Handles `ConnectionError` for when Ollama is offline with a friendly fallback message and actionable recommendations. |
| `frontend/src/hooks/useAnalysis.ts` | React hook managing analysis state (analyzing, result, error). Caches up to 20 recent analyses in `localStorage` with `ai-soc-analysis-history` key. Provides `analyze()`, `clearResult()`, `clearHistory()`, and `loadFromHistory()` methods. |
| `frontend/src/components/AIAnalysisPanel.tsx` | UI component for displaying analysis results. Has 4 states: **loading** (animated spinner with progress indicators), **error** (with retry button), **empty** (prompt to analyze), and **results** (full panel with summary, confidence ring, MITRE badge, FP probability badge, reasoning section, recommended actions, timestamp). Includes history sidebar showing recent analyses by alert ID. |
| `frontend/src/types/index.ts` (additions) | Added `AlertAnalysis` interface with fields: `summary`, `confidence`, `severity`, `mitre`, `reasoning`, `recommended_actions`, `false_positive_probability`, `analyzed_at`, `alert_id`. |

---

## Modified Files (4)

| File | Change |
|---|---|
| `Backend/ai/response_parser.py` | Updated to parse the new structured schema. Added regex-based markdown code fence removal. Added `_validate_and_fill()`, `_normalize_confidence()`, `_normalize_severity()`, `_normalize_actions()`, `_normalize_fp()`, and `_fallback()` methods. Backward compatible with old schema. |
| `Backend/api.py` | Added `from ai.analysis_service import AnalysisService`. Added `POST /analyze/alert` endpoint that accepts an alert JSON body and returns structured analysis. |
| `frontend/src/services/api.ts` | Added `analyzeAlert(alert)` method with 120-second timeout (LLMs are slow). Wraps response with `analyzed_at` timestamp and `alert_id` metadata. |
| `frontend/src/pages/Alerts.tsx` | Wired up the Analyze button. Added toggle between **Telemetry Inspector** (existing AlertCard) and **AI Analysis** (new AIAnalysisPanel). When user clicks a row in AlertTable, the right panel switches to Telemetry view. When user clicks Analyze, it triggers the AI and switches to Analysis view. |

---

## New Endpoints Added

| Endpoint | Method | Purpose | Timeout |
|---|---|---|---|
| `POST /analyze/alert` | POST | Accepts alert JSON, returns structured AI analysis via Ollama | 120s |

---

## AI Response Schema

```json
{
  "summary": "2-3 sentence analysis summary",
  "confidence": 94,
  "severity": "High",
  "mitre": "T1059.001",
  "reasoning": "Detailed reasoning paragraph",
  "recommended_actions": ["Action 1", "Action 2", "Action 3"],
  "false_positive_probability": "Low"
}
```

---

## Build Status

```
npm run build  →  ✅ SUCCESS (zero TypeScript errors)
  ↓
tsc -b          →  ✅ Passed cleanly
vite build      →  ✅ Passed (chunk size warning only — non-blocking)
```

---

## Known Limitations

1. **Ollama dependency**: The analysis requires Ollama to be running locally with `qwen2.5-coder:3b` (or configured model). When offline, the service returns a friendly error message with setup instructions and a Retry button.

2. **LLM latency**: First-time analysis may take 30-60s as the model loads into memory. Subsequent analyses are faster (2-10s). The 120s timeout should cover cold starts.

3. **Model output quality**: The current prompt instructs the LLM to return structured JSON. Smaller models (3B parameters) may occasionally produce malformed JSON — the `ResponseParser` handles this with a fallback, but the fallback message is less useful.

4. **History is localStorage-only**: AI analysis history is stored in `localStorage` per browser. Clearing browser data or using a different device will lose history. MAX_HISTORY is 20 entries.

5. **Cross-component state**: The analysis result stays in the `useAnalysis` hook instance within the Alerts page. If the user navigates to another page and back, the result is lost (though it remains in localStorage history).

---

## Recommendations for Sprint 05

1. **Add streaming support**: Modify the backend to stream LLM responses via Server-Sent Events (SSE) so the UI can display partial results as they arrive, improving perceived performance for long-running analyses.

2. **Model configuration UI**: Add a settings page option to configure the Ollama model name (currently hardcoded to `qwen2.5-coder:3b` in `ollama_client.py`). The frontend Settings page already has model selection inputs — wire them to the backend.

3. **Bulk analysis**: Allow selecting multiple alerts and running analysis on all of them. The backend already handles single alerts — extend to accept an array and return parallel results.

4. **Export analysis**: Add a "Copy Report" or "Export as PDF" button to the AIAnalysisPanel for sharing analysis results with team members.

5. **Incident-level AI analysis**: Connect the existing AIAnalysisCard (shown on the Incident page) to the new `POST /analyze/alert` endpoint so the incident investigation report is generated from the actual incident data rather than mock data.
