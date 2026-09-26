<div align="center">

<img src="public/favicon.svg" alt="SchemeSathi Logo" width="80" height="80"/>

# 🏛️ SchemeSathi AI

### AI-Powered Financial Scheme Discovery & Partner Routing Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-orange?style=for-the-badge&logo=india)](https://www.sih.gov.in/)
[![Team](https://img.shields.io/badge/Team-HEXA%20INNOVATORS-blue?style=for-the-badge)](https://github.com/Nivedha0621/HEXA-INNOVATORS_148-SIH26092)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **Empowering entrepreneurs and students to discover, understand, and apply for government financial schemes — in their own language, with AI-driven guidance.**

</div>

---

## 📌 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Team](#-team)

---

## 🎯 Problem Statement

Millions of eligible entrepreneurs and students in India remain unaware of — or unable to access — government financial schemes (loans, subsidies, and education funding). Key challenges include:

- **Information overload** — hundreds of schemes with complex eligibility criteria
- **Language barriers** — scheme documentation available only in English
- **Lack of guidance** — applicants do not know which scheme fits their profile
- **No centralized discovery** — no single platform that matches users to the right scheme
- **Geographic disconnect** — beneficiaries unaware of authorized channel partners nearby

---

## 💡 Our Solution

**SchemeSathi AI** is a full-stack web application that acts as a smart financial scheme navigator. Users fill out a simple profile form and our rule-based AI matching engine instantly identifies the most suitable government schemes — ranked by a multi-parameter compatibility score — with clear, explainable reasons.

```
User Profile → AI Matching Engine → Ranked Scheme Recommendations → Partner Routing
```

We bridge the gap between government schemes and their rightful beneficiaries through intelligent matching, multilingual support, and guided application assistance.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Scheme Matching** | Rule-based eligibility engine with weighted scoring across 5 parameters |
| 🌐 **Multilingual Support** | Full UI translation in **English**, **Tamil**, and **Hindi** |
| 🎙️ **Voice Input** | Web Speech API integration for hands-free profile entry |
| 📊 **EMI Calculator** | Interactive loan repayment planner with amortization breakdown |
| 📍 **Partner Locator** | Geo-location aware authorized channel partner finder |
| 📋 **Document Checklist** | Per-scheme required document tracker with preparation progress |
| 💬 **Explainable AI** | Every recommendation includes a clear explanation of why the user qualifies |
| 🛠️ **Admin Panel** | Full CRUD interface for scheme management with live API persistence |
| 📈 **User Dashboard** | Personalized summary of matched schemes, EMI estimates, and application status |

---

## 🔧 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **React Router v7** | Client-side SPA routing |
| **Recharts** | EMI amortization charts and data visualization |
| **Lucide React** | Icon library |
| **Vite 8** | Lightning-fast build tool and dev server |
| **Vanilla CSS** | Custom design system with CSS variables |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | RESTful API server |
| **JSON flat-file storage** | Scheme and partner data persistence |
| **CORS** | Cross-origin resource sharing |

### AI / Logic
| Component | Description |
|---|---|
| **Matching Engine** | Custom rule-based eligibility filter with 5-dimensional weighted scoring |
| **Haversine Formula** | Geo-distance calculation for nearest partner recommendation |
| **Score Normalization** | Position-in-range scoring for optimal fit detection |

---

## 🤖 AI Matching Engine — How It Works

Our matching engine operates in three stages:

### Stage 1 — Eligibility Filtering
Hard constraints are checked against the user profile:
- Age within scheme bounds
- Annual income within the scheme maximum
- Project or course cost within the scheme range
- Requested loan within the scheme maximum
- Business category or course type supported by the scheme
- State availability for state-specific schemes

Only fully eligible schemes proceed to Stage 2.

### Stage 2 — Weighted Match Scoring (0–100)

| Parameter | Weight | Logic |
|---|---|---|
| User Type Match | 20 pts | Binary — entrepreneur or student |
| Project Cost Fit | 25 pts | Position-in-range scoring (sweet spot: 10–90% of range) |
| Loan Amount Fit | 20 pts | Utilization ratio scoring (optimal: 30–95% of max) |
| Income Eligibility | 15 pts | Margin comfort scoring |
| Category / Course Match | 20 pts | Business or course type alignment |

### Stage 3 — Ranked Explanation
Each result is assigned a rank and given a human-readable explanation of why it ranked where it did — making the AI fully transparent and trustworthy.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
git clone https://github.com/Nivedha0621/HEXA-INNOVATORS_148-SIH26092.git
cd HEXA-INNOVATORS_148-SIH26092

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### Running Locally

```bash
npm run dev
```

This starts:
- Frontend at http://localhost:5173
- Backend API at http://localhost:3001

---

## 📁 Project Structure

```
HEXA-INNOVATORS_148-SIH26092/
├── index.html
├── vite.config.js
├── package.json
├── server/
│   ├── server.js
│   ├── data/
│   │   ├── schemes.json
│   │   └── partners.json
│   └── services/
│       └── matchingEngine.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── ProfileForm.jsx
    │   ├── Recommendations.jsx
    │   ├── SchemeDetails.jsx
    │   ├── ExploreSchemes.jsx
    │   ├── EMICalculator.jsx
    │   ├── PartnerLocator.jsx
    │   ├── Dashboard.jsx
    │   └── Admin.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Hero.jsx
    │   ├── RecommendationCard.jsx
    │   ├── PartnerCard.jsx
    │   ├── DocumentChecklist.jsx
    │   ├── EligibilityExplanation.jsx
    │   ├── EMICalculatorWidget.jsx
    │   ├── LanguageSelector.jsx
    │   └── VoiceInput.jsx
    ├── hooks/
    │   └── useLanguage.jsx
    ├── services/
    │   ├── api.js
    │   └── matchingEngine.js
    ├── translations/
    │   └── index.js
    └── utils/
        └── emi.js
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/schemes | Get all schemes |
| GET | /api/schemes/:id | Get scheme by ID |
| POST | /api/schemes | Add a new scheme |
| PUT | /api/schemes/:id | Update an existing scheme |
| DELETE | /api/schemes/:id | Delete a scheme |
| POST | /api/match | Match schemes to user profile |
| GET | /api/partners | Get partners with optional filters |

**Match Request Body Example:**
```json
{
  "userType": "entrepreneur",
  "age": 28,
  "state": "Tamil Nadu",
  "annualIncome": 250000,
  "projectCost": 500000,
  "requiredLoan": 400000,
  "businessCategory": "small-industry"
}
```

**Match Response Example:**
```json
[
  {
    "scheme": { "name": "MUDRA Shishu" },
    "matchScore": 92,
    "rank": 1,
    "isEligible": true,
    "eligibilityReasons": ["Your age meets the eligibility requirement"],
    "rankingExplanation": "Ranked #1 because this scheme provides the closest financial match."
  }
]
```

---

## 👥 Team

**Team Name:** HEXA INNOVATORS  
**SIH Problem ID:** 148  
**Hackathon:** Smart India Hackathon 2026

| Member | Role |
|---|---|
| Nivedha R | Full Stack Developer and Team Lead |

---

## 📜 Disclaimer

This is a **prototype** developed for Smart India Hackathon 2026 demonstration purposes. Scheme data and partner information are representative samples. Final eligibility must be verified with the respective authorized government agencies.

---

<div align="center">

**© 2026 SchemeSathi AI — Smart India Hackathon 2026 | Team HEXA INNOVATORS**

*Built with love for Bharat's entrepreneurs and students*

</div>
