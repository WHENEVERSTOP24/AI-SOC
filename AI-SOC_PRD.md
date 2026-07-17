## Section Overview

1. Project Overview

2. Objectives

3. Technology Stack

4. Folder Structure

5. Design Language

6. Pages

7. Components

8. API Integration

9. User Flow

10. Dashboard Layout

11. Theme

12. Future Scope

13. Rules for the AI Agent


## Section 1 — Project Overview

AI-SOC is an AI-powered Security Operations Center platform that detects suspicious Windows activity using Sysmon logs, correlates alerts into incidents, calculates risk scores, maps detections to MITRE ATT&CK, and generates AI-powered investigation reports using a local LLM (Ollama). The backend is already complete. Your task is to build a professional frontend only.


## Section 2 — Objectives

Build a production-quality SOC dashboard.
Display alerts and incidents.
Visualize AI investigations.
Integrate with backend APIs.
Do not modify backend code.

Section 3 — Technology
React

TypeScript

TailwindCSS

React Router

Axios

Recharts

Lucide Icons

Vite

## Section 4 — Folder Structure

The frontend must follow a clean, modular, and scalable folder structure. Components should be reusable, pages should remain lightweight, and API communication should be centralized.

```text
Frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── AlertCard.tsx
│   │   ├── AlertTable.tsx
│   │   ├── AIAnalysisCard.tsx
│   │   ├── IncidentTimeline.tsx
│   │   ├── MitreBadge.tsx
│   │   ├── Navbar.tsx
│   │   ├── RiskGauge.tsx
│   │   ├── SeverityBadge.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatCard.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Alerts.tsx
│   │   ├── Incident.tsx
│   │   ├── Mitre.tsx
│   │   ├── Simulator.tsx
│   │   └── Settings.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── hooks/
│   │
│   ├── layouts/
│   │   └── MainLayout.tsx
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

### Folder Guidelines

- **assets/** stores images, logos, icons, and static resources.
- **components/** contains reusable UI components.
- **pages/** contains top-level application pages.
- **services/** contains all API communication using Axios.
- **hooks/** contains custom React hooks.
- **layouts/** contains reusable application layouts.
- **types/** stores TypeScript interfaces and types.
- **utils/** contains helper and utility functions.

The frontend must remain modular and scalable. Business logic should not be placed inside page components. API calls must be centralized in the services directory, and reusable UI elements must be placed inside the components directory.

## Section 5 — Design Language

Inspired by professional SOC platforms.
Minimal.
Modern.
Dark theme.
Spacious layout.
Clean typography.
Subtle animations.
No neon hacker aesthetic.
Prioritize readability.


## Section 6 — Pages

## Dashboard
Contains:
Statistics cards
Recent alerts
Risk chart
MITRE chart
Latest AI investigation

## Alerts
Contains:
Search
Filters
Sort
Alert table

## Incident
Contains:
Timeline
Host
User
AI Summary
Recommendations
MITRE
Confidence

## Simulator
Contains buttons:
PowerShell
CMD
CertUtil
MSHTA
RunDLL32
Regsvr32
WMIC

Each button triggers the backend simulator.

## Section 7 — Components

List reusable components.
Navbar

Sidebar

AlertCard

StatCard

Timeline

RiskGauge

MitreBadge

SeverityBadge

AIAnalysisCard

AlertTable


## Section 8 — API Integration

GET /alerts

GET /incidents

GET /incident/{id}

GET /mitre

GET /dashboard

POST /simulate/{attack}

## Section 9 — User Flow
Open Dashboard.
View alert summary.
Click an alert.
Open incident details.
Read AI investigation.
View MITRE mapping.
Run a simulator attack.
Refresh dashboard and see the new alert.

## Section 10 — Dashboard Layout
Left sidebar for navigation.
Top navbar with branding.
Statistic cards at the top.
Charts in the middle.
Recent alerts table below.
AI investigation panel on the right (or below on smaller screens).

## Section 11 — Theme
Dark background.
Purple accent.
Red/Orange/Yellow/Green severity badges.
Rounded cards.
Consistent spacing.
Mobile-friendly layout.

## Section 12 — Future Scope

Mention features that are not part of v1.0, such as:

Multi-user authentication.
Live WebSocket updates.
Email notifications.
Historical analytics.
Linux log support.
Cloud deployment.

## Section 13 — Rules for the AI Agent

Do not modify anything inside the Backend/ directory.
Only generate or modify files inside Frontend/.
Use reusable React components.
Use TypeScript for all components.
Use TailwindCSS for styling.
Avoid hardcoded data; consume backend APIs.
Keep components modular and maintainable.
Do not introduce unnecessary dependencies.
Follow responsive design principles.
Generate production-quality code.