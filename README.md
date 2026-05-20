# ApnaFarrukhabad

District-first digital platform for Farrukhabad, Uttar Pradesh. This application combines local news, civic reporting, agriculture intelligence, weather alerts, video content, and community workflows in a mobile-first web experience.

## 1) What is this project?

ApnaFarrukhabad is a React-based community platform designed to centralize district-level information and participation.

It enables:

- Citizens to discover local updates quickly.
- Residents to submit news/incidents with image proof.
- Admin teams to moderate and publish submissions.
- Farmers to access mandi prices, weather signals, and practical insights.

## 2) Why does this exist?

Local communities often rely on fragmented channels for updates (social media forwards, isolated groups, and word-of-mouth). This creates trust, speed, and discoverability gaps.

ApnaFarrukhabad addresses those gaps through:

- A single local information hub.
- Structured moderation for higher content trust.
- Mobile-first UX for users with low-end devices and variable network quality.
- Domain-specific modules for agriculture, villages, alerts, and local commerce.

## 3) How does it work?

High-level workflow:

1. Users browse curated and real-time local sections.
2. Authenticated users can submit reports from the report flow.
3. Media is uploaded to Cloudinary from the browser.
4. Submission enters moderation with pending status.
5. Admin approves/rejects content from admin tools.
6. Approved content is surfaced in public sections.

## Core Capabilities

- Mobile-first responsive UI across key pages and sections.
- Community reporting and moderation workflow.
- Phone verification flow with Firebase Authentication.
- News, reels, trending content, and category-based browsing.
- Farming intelligence and mandi rate modules.
- Weather and alert sections for local visibility.
- Marketplace and village exploration modules.
- Role-aware navigation and admin pages.

## Tech Stack

### Frontend

- React 19
- React DOM 19
- React Router DOM 6
- Vite 8
- Tailwind CSS 3
- Framer Motion
- Lucide React

### Form and Validation

- React Hook Form
- Zod
- @hookform/resolvers

### Backend Services (BaaS and Integrations)

- Firebase (Auth + Firestore + Hosting configuration)
- Cloudinary (unsigned image uploads)

### Tooling and Quality

- ESLint 10
- @vitejs/plugin-react
- PostCSS
- Autoprefixer

## Architecture Overview

- Frontend SPA built with Vite + React.
- Routing and guard logic handled in app/layout routing modules.
- Shared state through React Context for auth, language, and toasts.
- Service layer for Firebase, Cloudinary, weather, and API abstractions.
- Firebase Hosting configured with SPA rewrite to index.html.

## Project Structure

```text
.
|- src/
|  |- components/           # Reusable UI and feature sections
|  |- contexts/             # App-wide state (auth, language, toast)
|  |- hooks/                # Reusable hooks (auth, location, weather)
|  |- layout/               # Layouts and route guards
|  |- pages/                # Route-level pages (user and admin)
|  |- services/             # External service adapters and integrations
|  |- utils/                # Utility helpers
|  |- data/                 # Static/demo datasets
|  |- App.jsx               # Route composition
|  |- main.jsx              # App bootstrap
|  |- index.css             # Global styles and tokens
|- firebase.json            # Hosting and deploy config
|- firestore.rules          # Firestore security rules
|- eslint.config.js         # Lint rules
|- vite.config.js           # Vite config
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Firebase CLI (for deployment)

### Installation

```bash
npm install
```

### Environment Configuration

Copy the environment template and update values:

```bash
cp .env.example .env
```

Recommended variables:

```bash
# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
VITE_CLOUDINARY_UPLOAD_FOLDER=apnafarrukhabad/news

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Weather
VITE_WEATHER_API_KEY=your_weather_api_key
VITE_WEATHER_LOCATION=Farrukhabad
VITE_WEATHER_LAT=27.3913
VITE_WEATHER_LON=79.5792
VITE_WEATHER_UNITS=metric
VITE_WEATHER_LANGUAGE=en
```

### Run Locally

```bash
npm run dev
```

Default local URL: http://localhost:5173

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm run preview  # Preview production build
npm run lint     # Run lint checks
```

## Authentication and Phone Verification

Phone verification uses Firebase Authentication (phone provider). Setup instructions are documented in FIREBASE_PHONE_AUTH_SETUP.md.

## Deployment

Firebase Hosting is configured with:

- Public directory: dist
- Predeploy build: npm run build
- SPA rewrites to index.html

Production URL:

- https://apna-farrukhabad.web.app/

Deploy steps:

```bash
firebase login
firebase use apna-farrukhabad
firebase deploy
```

## Security and Quality Notes

- Firestore rules are maintained in firestore.rules.
- Client-side form validation is implemented with Zod and React Hook Form.
- Linting enforced through ESLint configuration.
- Moderation flow is used before surfacing user-generated reports publicly.

## Documentation

- FIREBASE_PHONE_AUTH_SETUP.md: Phone auth onboarding and troubleshooting.
- WORKFLOW_GUIDE.md: End-to-end user/admin workflow guide.
- PHASE_2_COMPLETION.md: Milestone notes and delivered scope.

## Roadmap Suggestions

- Add automated tests (unit + integration + e2e).
- Introduce CI checks for lint, build, and preview smoke tests.
- Add observability (error tracking and performance monitoring).
- Add role-based permission hardening and audit logging for admin actions.

## License

No license file is currently defined in this repository. Add a LICENSE file to clarify usage rights for contributors and partners.
