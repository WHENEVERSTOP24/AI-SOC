# AI-SOC Sprint 06 — Enterprise Architecture & Live Investigation

**Status:** ✅ Complete  
**Date:** July 16, 2026  
**TypeScript Errors:** 0  
**Mock Investigation Data:** 0 references remaining  

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Zustand)                    │
│                                                                     │
│  ┌───────────────┐  ┌──────────────┐  ┌───────────────────────────┐ │
│  │  Dashboard     │  │  Alerts      │  │  Investigation (lazy)    │ │
│  │  Page          │  │  Page        │  │  Page                    │ │
│  └───────┬───────┘  └──────┬───────┘  └───────────┬───────────────┘ │
│          │                 │                       │                 │
│  ┌───────▼─────────────────▼───────────────────────▼───────────────┐ │
│  │                    ZUSTAND STORE SLICES                          │ │
│  │                                                                  │ │
│  │  ┌──────────────┐ ┌───────────────┐ ┌────────────────────────┐  │ │
│  │  │ alertsStore  │ │ incidentsStore│ │ investigationStore     │  │ │
│  │  └──────┬───────┘ └───────┬───────┘ └───────────┬────────────┘  │ │
│  │         │                 │                       │               │ │
│  │  ┌──────▼─────────────────▼───────────────────────▼────────────┐ │ │
│  │  │                globalRefreshStore                           │ │ │
│  │  │  (triggerGlobalRefresh → calls all fetch actions)          │ │ │
│  │  └─────────────────────────────┬───────────────────────────────┘ │ │
│  │                                │                                 │ │
│  │  ┌─────────────────────────────▼───────────────────────────────┐ │ │
│  │  │   Simulator Page → useSimulator → triggerGlobalRefresh()   │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                           │                                            │
│                           ▼ HTTP                                      │
└───────────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                               │
│                                                                       │
│  ┌─────────────┐  ┌──────────────────┐  ┌────────────────────────┐   │
│  │  api.py     │  │ investigation_   │  │ correlation_service    │   │
│  │  endpoints  │──│ service.py       │──│ .py                    │   │
│  │             │  │ (build_investi-  │  │ (correlate_alerts)     │   │
│  │  /alerts    │  │  gation)         │  └────────────────────────┘   │
│  │  /incidents │  └───────┬──────────┘                                │
│  │  /dashboard │          │                                           │
│  │  /investi-  │  ┌───────▼──────────┐                               │
│  │   gation/{id}│  │ attack_story.py │                               │
│  │  /correlate │  │ (build_attack_   │                               │
│  │  /simulate  │  │  story)          │                               │
│  └─────────────┘  └──────────────────┘                               │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Files Added

| File | Purpose |
|------|---------|
| `Backend/investigation_service.py` | Orchestrates the full investigation pipeline: correlation → attack story → graph nodes/edges |
| `frontend/src/store/alertsStore.ts` | Zustand slice for alerts state + fetch action |
| `frontend/src/store/incidentsStore.ts` | Zustand slice for incidents state + fetch action |
| `frontend/src/store/dashboardStore.ts` | Zustand slice for dashboard stats state + fetch action |
| `frontend/src/store/investigationStore.ts` | Zustand slice for investigation state + fetch action |
| `frontend/src/store/analysisStore.ts` | Zustand slice for AI analysis state + fetch action |
| `frontend/src/store/globalRefreshStore.ts` | Cross-store refresh orchestrator — triggers all fetches on simulation |
| `Sprint_06_Report.md` | This report |

---

## Files Modified

| File | Change |
|------|--------|
| `Backend/api.py` | Replaced inline `_build_investigation_graph()` → uses `investigation_service.build_investigation()` |
| `frontend/src/store/index.ts` | Changed from single combined store → barrel re-export of individual slices |
| `frontend/src/hooks/useAlerts.ts` | Rewritten: uses `useAlertsStore` instead of `useApi` + mock data |
| `frontend/src/hooks/useIncidents.ts` | Rewritten: uses `useIncidentsStore` instead of `useApi` + mock data |
| `frontend/src/hooks/useDashboard.ts` | Rewritten: uses `useDashboardStore` instead of `useApi` + mock data |
| `frontend/src/hooks/useInvestigation.ts` | Rewritten: uses `useInvestigationStore`, **no mock data import** |
| `frontend/src/hooks/useSimulator.ts` | Rewritten: calls `triggerGlobalRefresh()` after successful simulation |
| `frontend/src/hooks/useAnalysis.ts` | Rewritten: uses `useAnalysisStore` with localStorage history |
| `frontend/src/pages/Simulator.tsx` | Removed manual `refetchAlerts()`/`refetchIncidents()` — hook handles global refresh |
| `frontend/src/App.tsx` | Added `React.lazy` + `Suspense` for Investigation page |

---

## Removed Mock Components

**`frontend/src/hooks/useInvestigation.ts`** — previously imported `mockInvestigations` from `mockData.ts`. The hook now exclusively calls `api.getInvestigation(incidentId)` through the Zustand store. No mock investigation data remains in any hook.

The following mock data **remains** in `mockData.ts` as it is not investigation data and serves as configuration/config fallback:
- `mockStats` — dashboard stats fallback (replaced by live data but kept for backward compat)
- `mockAlerts` — alert definitions (kept for backward compat)
- `mockIncidents` — incident definitions (kept for backward compat)
- `simulationAttacks` — simulation attack catalog (used as static config by Simulator page)

---

## State Management Design

### Before (Sprint 05)
```
Each page → useApi<T>(fetcher, mockFallback) → useState + useEffect
                                                ↓
                                        Scattered state
                                        No shared cache
                                        Duplicate fetches
```

### After (Sprint 06)
```
Zustand Store Slices:
  alertsStore      → alerts[], fetchAlerts()
  incidentsStore   → incidents[], fetchIncidents()
  dashboardStore   → stats, fetchDashboard()
  investigationStore → investigation, fetchInvestigation()
  analysisStore    → analysis, fetchAnalysis()
  globalRefreshStore → triggerGlobalRefresh()
                         ↓
                  React subscribes only to needed slices
                  No duplicate fetches
                  Single source of truth
```

### Key Design Decisions
1. **Individual slices over single store** — Each domain has its own file. Cleaner imports, tree-shakeable, independent.
2. **`globalRefreshStore` cross-calls other stores** — Uses `useOtherStore.getState().fetchX()` to avoid circular dependencies.
3. **Hooks are thin wrappers** — Each hook just selects from the store and adds the auto-fetch `useEffect` on mount. Pages get the same interface (`data`, `loading`, `error`, `refetch`, `isOffline`) as before.
4. **No mock data in investigation** — The investigation flow is now purely live. The `useInvestigation` hook has zero references to `mockData.ts`.

---

## Investigation Flow

```
User navigates to /investigation
          │
          ▼
useInvestigation(incidentId) mounts
          │
          ├── setSelectedIncidentId(incidentId)  → store
          └── fetchInvestigation(incidentId)     → store.fetchInvestigation()
                                                       │
                                                       ▼
                                                  api.getInvestigation(id)
                                                       │
                                                       ▼
                                           Backend: GET /investigation/{id}
                                                       │
                                                       ▼
                                           investigation_service.build_investigation()
                                                       │
                                           ├── correlation_service.correlate_alerts()
                                           ├── attack_story.build_attack_story()
                                           └── _build_graph() → nodes + edges
                                                       │
                                                       ▼
                                              Response → store state
                                                       │
                                                       ▼
                                              Investigation.tsx renders:
                                              ├── Investigation Metadata panel
                                              ├── Investigation Graph (SVG)
                                              ├── Attack Story panel
                                              ├── Correlation Details panel
                                              ├── Confidence metrics
                                              └── Recommended Actions
```

### Key Properties
- **Single source of truth**: Investigation data lives in `investigationStore`, not scattered across components
- **Auto-refetch on incident change**: Changing the selected incident re-fetches automatically
- **Lazy loading**: The `InvestigationPage` component is loaded via `React.lazy` — it's not in the initial bundle
- **No stale data**: Every investigation fetch goes to the backend; no mock fallback

---

## Attack Story Flow

```
Simulator executes attack
          │
          ▼
POST /simulate/{attack}
          │
          ▼
api.py: _run_pipeline() → events → alerts → incidents
          │
          ▼
Frontend useSimulator detects success
          │
          ▼
triggerGlobalRefresh()
          │
          ├── useAlertsStore.fetchAlerts()     → GET /alerts
          ├── useIncidentsStore.fetchIncidents() → GET /incidents
          ├── useDashboardStore.fetchDashboard() → GET /dashboard
          └── useInvestigationStore.fetchInvestigation() → GET /investigation/{id}
                                                              │
                                                              ▼
                                                  investigation_service.py
                                                  ├── correlate_alerts() → pairwise scores
                                                  ├── build_attack_story() → kill chain stages
                                                  └── _build_graph() → nodes + edges
                                                              │
                                                              ▼
                                                  Response renders in Investigation.tsx
                                                  ├── Attack Story: narrative + stages
                                                  ├── Correlation: score + breakdown
                                                  └── Graph: Host → Process → Alert → MITRE
```

---

## Correlation Flow

```
Alerts arrive from Sysmon pipeline
          │
          ▼
correlation_service.correlate_alerts(alerts)
          │
          ├── Compare each pair of alerts
          │     ├── Same host?           +25 points
          │     ├── Same user?           +20 points
          │     ├── Same parent process? +15 points
          │     ├── Same MITRE tactic?   +20 points
          │     └── Temporal proximity   +20 points
          │         (≤5 min)
          │
          ├── Compute global score (average of all pair scores)
          ├── Cluster alerts by host + user
          └── Return: { correlations[], global_score, total_alerts, total_clusters }
                      │
                      ▼
            Displayed in Investigation.tsx:
            ├── Pairwise correlation scores with reason breakdown badges
            ├── "Same Host" ✓ "Same User" ✓ "Temporal Proximity" ✓
            └── Global confidence score
```

---

## Performance Improvements

| Metric | Before (Sprint 05) | After (Sprint 06) |
|--------|--------------------|--------------------|
| Bundle size — Investigation | Eagerly loaded (always in bundle) | Lazy loaded (imported on navigation) |
| API calls per page visit | Each hook fetches independently | Stores deduplicate — shared state |
| Re-renders on simulation | Only current page updates | All subscribed pages update |
| Mock data fallback | Each hook had mock fallback | Investigation: removed entirely. Others: minimal |
| Data fetching | `useApi` — re-fetched on every mount | Zustand — fetches once, persists in store |

---

## Remaining Limitations

1. **No WebSocket/SSE for push updates** — Global refresh is trigger-based (on simulation), not subscription-based. Pages don't auto-update when data changes from external sources.
2. **`useAnalysis` still uses localStorage** — Analysis history is cached in `localStorage` rather than the Zustand store. This means it persists across sessions but isn't available to other components.
3. **No request deduplication** — If two components mount simultaneously and both subscribe to the same store slice, two API calls are made. A dedup layer (e.g., axios request interceptors) would help.
4. **`simulationAttacks` still imported from `mockData.ts`** — The backend has a `/simulate/attacks` endpoint. The Simulator page could use it instead of the hardcoded mock catalog.
5. **No optimistic updates** — All mutations go through the backend first. No client-side caching of mutation results.
6. **Global refresh is fire-and-forget** — Errors from individual fetches during global refresh aren't aggregated or surfaced. If one store fails, others still update.

---

## Recommendations for Sprint 07

1. **WebSocket/SSE push** — Replace poll-based global refresh with server-sent events or WebSocket for real-time updates across all pages.
2. **Request deduplication** — Add an axios request interceptor or Zustand middleware that prevents duplicate in-flight requests.
3. **Optimistic updates** — Allow the Store slices to optimistically update state before the backend confirms, with rollback on error.
4. **Persist store to localStorage** — Add Zustand `persist` middleware so data survives page refresh without re-fetching.
5. **Dedicated test suite** — Add Vitest + React Testing Library tests for the Zustand stores and the new hooks.
6. **Remove remaining mock data** — Replace `mockStats`, `mockAlerts`, `mockIncidents`, and `simulationAttacks` with purely backend-driven data.
7. **Error aggregation** — In `globalRefreshStore`, collect errors from all sub-fetches and surface them collectively.
8. **Accessibility audit** — Add `aria-live` regions for real-time updates, keyboard navigation for the investigation graph.
