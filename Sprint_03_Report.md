# Sprint 03 — Backend Integration Report

**Date:** July 16, 2026
**Status:** ✅ Complete
**Build:** ✅ Passes (`npm run build` — zero TypeScript errors)

---

## Files Modified

### Backend (1 file)

| File | Change |
|---|---|
| `Backend/api.py` | Extended with **8 new REST endpoints** wrapping the existing detection pipeline. No detection, simulation, normalization, risk, or AI logic was modified. |

### Frontend (10 files)

| File | Change |
|---|---|
| `frontend/src/services/api.ts` | Rewritten with proper TypeScript response types, Axios error handling, timeout (15s), and graceful degradation when backend is unreachable |
| `frontend/src/hooks/useApi.ts` | **New** — Generic async data-fetching hook with loading/error/offline states and retry capability |
| `frontend/src/hooks/useAlerts.ts` | **New** — Wraps `api.getAlerts()` with mock data fallback |
| `frontend/src/hooks/useIncidents.ts` | **New** — Wraps `api.getIncidents()` and `api.getIncidentById()` with mock data fallback |
| `frontend/src/hooks/useDashboard.ts` | **New** — Wraps `api.getDashboardStats()` with mock data fallback |
| `frontend/src/hooks/useSimulator.ts` | **New** — Manages simulation state (running, success, error) with cleanup |
| `frontend/src/pages/Dashboard.tsx` | Replaced static mock data with `useDashboardStats()` and `useIncidents()`. Added loading skeleton, offline banner, refresh button |
| `frontend/src/pages/Alerts.tsx` | Replaced static mock alerts with `useAlerts()`. Added loading spinner, offline banner, error display, refresh button |
| `frontend/src/pages/Incident.tsx` | Replaced static mock incidents with `useIncidents()`. Added loading indicator, refresh button |
| `frontend/src/pages/Simulator.tsx` | Calls `POST /simulate/{attack}` via `useSimulator()` hook. Falls back to local dry-run when backend is unavailable. Shows success/error states on attack cards |

---

## APIs Connected

### Existing Endpoints (Preserved — No Changes)

| Endpoint | Method | Description |
|---|---|---|
| `GET /` | ✅ Preserved | Health check, now includes `version` field |
| `GET /events` | ✅ Preserved | Returns raw Sysmon events |
| `GET /analyze` | ✅ Preserved | Returns detection + AI analysis for latest Sysmon event |

### New Endpoints Added

| Endpoint | Method | Connected To | Description |
|---|---|---|---|
| `GET /alerts` | ✅ **New** | Alerts page, Dashboard | Returns all alerts from pipeline, serialized to frontend `Alert` type |
| `GET /incidents` | ✅ **New** | Incident page, Dashboard | Returns all correlated incidents with timeline, MITRE mapping, recommendations |
| `GET /incident/{id}` | ✅ **New** | (Future: Incident detail) | Returns single incident with full AI analysis (Ollama) |
| `GET /dashboard` | ✅ **New** | Dashboard | Returns aggregated stats: alert count, incident count, risk level, MITRE coverage, host count |
| `GET /mitre` | ✅ **New** | (Future: MITRE page) | Returns unique MITRE techniques with detection counts across all active incidents |
| `POST /simulate/{attack}` | ✅ **New** | Simulator page | Runs attack via `AttackSimulator`, re-runs pipeline to capture new events |
| `GET /simulate/attacks` | ✅ **New** | (Future use) | Lists available attack simulations |
| `GET /health` | ✅ **New** | (Frontend health checks) | Reports backend status, Sysmon availability, pipeline cache state |

### Data Transformation

The API layer transforms backend Python data shapes to frontend TypeScript types:

- `Alert`: Maps `rule` → `rule_name`, `computer` → `host`, `image` → `process_name`, `reason` → `description`, normalizes severity and status enums
- `Incident`: Maps `overall_risk` (0–100) → `risk_score` (0–10), `start_time` → `created_at`, `status` ACTIVE → OPEN
- `DashboardStats`: Computed from pipeline state (active alerts, open incidents, unique hosts, MITRE coverage percentage)

### Frontend Error Handling Pattern

All pages use the `useApi<T>()` generic hook which implements:

1. **Loading state**: Skeleton/spinner shown during fetch
2. **Error state**: Offline banner with error message, mock data fallback active
3. **Empty state**: Handled by each component (e.g., AlertTable shows "No alerts found")
4. **Retry**: Refresh button on Dashboard and Alerts pages calls `refetch()`
5. **Graceful degradation**: When backend is unreachable, `api.ts` catches the Axios error and returns `{ status: 'error' }`, causing `useApi` to fall back to mock data silently

---

## Remaining Mock Data

These areas still use hardcoded demo data because no backend endpoint provides them:

| Data | Used In | Reason |
|---|---|---|
| Chart timeline data (`alertTimelineData`, `mitreTacticData`) | Dashboard | No backend endpoint for hourly alert volume or MITRE tactic distribution |
| `simulationAttacks` array | Simulator | Backend `/simulate/attacks` endpoint exists but the frontend currently uses the mock list |
| MITRE matrix columns with technique details | MITRE page | Backend `/mitre` returns technique IDs but not the full matrix layout with tactic columns |
| Settings page | Settings | No backend configuration endpoint exists |
| Rich incident narrative (title, ai_summary) | Dashboard spotlight, Incident page | Backend generates these via Ollama only on detail view; list view has generic titles |

---

## Build Status

```
npm run build  →  ✅ SUCCESS (zero TypeScript errors, zero warnings)
  ↓
tsc --noEmit   →  ✅ Passed cleanly
vite build     →  ✅ Passed (asset chunk warning only — non-blocking)
```

---

## Known Limitations

1. **Sysmon dependency**: The detection pipeline requires `win32evtlog` (Windows + Sysmon installed). On non-Windows systems, all endpoints return `{"status": "unavailable"}` and the frontend falls back to mock data gracefully.

2. **Cross-component refresh**: When the Simulator runs an attack successfully, it calls `refetchAlerts()` on its own `useAlerts()` instance. This does **not** refresh the Alerts page's data because each component has an independent hook instance. A global state solution (React Query, Zustand) would be needed for cross-component cache invalidation.

3. **Ollama availability**: The `/incident/{id}` detail endpoint tries to call Ollama for AI analysis. If Ollama isn't running, it fails silently and returns `"AI analysis unavailable (Ollama may not be running)."` The incident list view does not attempt Ollama calls.

4. **In-memory state**: `AlertManager` and `CorrelationEngine` hold state in memory (Python lists). Each REST API request re-runs the pipeline from scratch, resetting all state. This means alerts/incidents are ephemeral and don't persist between requests if the pipeline returns different data.

5. **Frontend port**: The frontend defaults to `http://localhost:8000` (FastAPI). The Flask server on port 5000 is not used by the frontend.

---

## Recommendations for Sprint 04

1. **Add React Query (TanStack Query)** to replace the custom `useApi` hook. This would provide automatic cache invalidation, cross-component data sharing, background refetching after mutations (e.g., after simulation), and built-in retry logic — solving the cross-component refresh limitation.

2. **Populate the MITRE page** from backend data. The `/mitre` endpoint now returns technique IDs with counts. The MITRE page's hardcoded matrix columns could be dynamically populated from a backend technique registry.

3. **Add the `/simulate/attacks` data** to the Simulator page. Instead of using the hardcoded `simulationAttacks` array from `mockData.ts`, fetch the attack list from `GET /simulate/attacks` when the backend is available.

4. **Persist pipeline state** in the backend. Add simple SQLite persistence to `AlertManager` and `CorrelationEngine` so that alerts and incidents survive server restarts and are shared across requests.

5. **Add `POST /events` endpoint** for event ingestion without requiring Sysmon. Allow the frontend to submit events directly for testing/demo purposes.

6. **Unify backend servers**. Consider removing the Flask `app.py` in favor of the FastAPI `api.py` as the single backend entry point, reducing confusion between ports 5000 and 8000.
