<![CDATA[<div align="center">

# 🎓 DIMMS

### Digital Internship & Mentorship Management System

A full-stack web application for managing internship workflows between **Students**, **Mentors**, **Faculty Guides**, and **Administrators** — built with Next.js 16, Tailwind CSS v4, and shadcn/ui.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Features

### 🔐 Role-Based Access Control
Four distinct user roles, each with their own dedicated dashboard and capabilities:

| Role | Dashboard | Capabilities |
|:-----|:----------|:-------------|
| **Admin** | `/admin` | Manage users, programs, internships; view system-wide statistics |
| **Student** | `/student` | View tasks, submit work, write weekly reports, download certificates |
| **Mentor** | `/mentor` | Create tasks, review submissions, provide feedback & ratings |
| **Faculty** | `/faculty` | Monitor student progress, review mentor feedback, approve completions |

### 📋 Internship Lifecycle Management
- **Program Creation** — Admins define internship programs with title, organization, and duration
- **Internship Assignment** — Link students to mentors and faculty guides
- **Task Management** — Mentors create tasks with deadlines; students submit work with text updates and files
- **Weekly Reports** — Students submit structured weekly reports; mentors rate and provide feedback
- **Completion Workflow** — Mentor recommendation → Faculty approval → Certificate generation

### 🤖 AI-Powered Analysis
- **Report Quality Analysis** — Automated assessment of weekly report quality, engagement, and completeness
- **Enhanced Feedback** — AI-assisted feedback generation with multiple tones (encouraging, constructive, formal)
- **Performance Suggestions** — Data-driven recommendations for improving student performance

### 🏆 Certificate Generation
- **Luxury Gold & Black PDF** — Professionally designed certificate with ornamental borders and gold typography
- **Auto-populated** — Student name, program, duration, mentor & faculty signatures
- **Instant Download** — Client-side PDF generation via `html2pdf.js`

### 🌌 Aurora Background
- Animated aurora borealis effect across the entire application
- Glassmorphism header with backdrop blur on dashboard pages
- Fully transparent layout — the aurora is visible everywhere

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **PDF Generation** | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |
| **Database** | Mock in-memory database (production-ready interface) |

---

## 📁 Project Structure

```
ims/
├── app/
│   ├── layout.tsx              # Root layout with Aurora background
│   ├── page.tsx                # Landing page with hero section
│   ├── login/page.tsx          # Authentication page
│   ├── admin/page.tsx          # Admin dashboard
│   ├── student/page.tsx        # Student dashboard
│   ├── mentor/page.tsx         # Mentor dashboard
│   └── faculty/page.tsx        # Faculty dashboard
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── aurora-background.tsx
│   │   ├── button.tsx, card.tsx, dialog.tsx, ...
│   ├── layout/
│   │   └── protected-layout.tsx  # Auth guard + navigation header
│   ├── admin/                  # Admin-specific modals
│   ├── student/                # Student-specific components
│   │   ├── certificate-section.tsx
│   │   ├── task-submission-modal.tsx
│   │   └── weekly-report-modal.tsx
│   ├── mentor/                 # Mentor-specific components
│   ├── faculty/                # Faculty-specific components
│   ├── HeroSection.tsx         # Landing page hero
│   └── LoginCard.tsx           # Login form card
├── lib/
│   ├── mock-db.ts              # In-memory database with mock data
│   ├── auth.ts                 # Authentication utilities (localStorage)
│   ├── ai-analysis.ts          # AI report analysis & feedback
│   └── utils.ts                # Utility functions
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ — [Download here](https://nodejs.org/)
- **npm** 9+ (bundled with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone git@github.com:Vansh-Gokhale/DIMMS.git
cd DIMMS

# 2. Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The app starts on **[http://localhost:3009](http://localhost:3009)**.

### Production Build

```bash
npm run build
npm start
```

---

## 🔑 Demo Credentials

Use these credentials to explore the different dashboards:

| Role | Email | Password |
|:-----|:------|:---------|
| 🛡️ **Admin** | `admin@dimms.com` | `admin123` |
| 🎓 **Student** | `student@example.com` | `student123` |
| 👨‍💼 **Mentor** | `mentor@example.com` | `mentor123` |
| 👩‍🏫 **Faculty** | `faculty@university.edu` | `faculty123` |

> **Tip:** Each role has a unique dashboard. Try logging in with different credentials to explore all four portals.

---

## 📸 Screenshots

### Landing Page
The homepage features an animated Aurora background with a hero section and quick-access login card.

### Student Dashboard
Track internship progress, view assigned tasks, submit work, write weekly reports, and download your completion certificate.

### Mentor Dashboard
Manage interns, create tasks with deadlines, review student submissions, and provide rated feedback on weekly reports.

### Faculty Dashboard
Monitor student progress across internships, review mentor recommendations, and approve/reject internship completions with grading.

### Admin Dashboard
Full system overview with user management, program creation, and internship assignment capabilities.

### Certificate
Luxury gold & black PDF certificate with ornamental borders, automatically populated with student and program details.

---

## 🔄 Internship Workflow

```
┌─────────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  Admin   │────▶│  Assign  │────▶│   Student    │────▶│   Mentor    │
│ Creates  │     │ Student, │     │  Works on    │     │  Reviews &  │
│ Program  │     │ Mentor,  │     │  Tasks &     │     │  Provides   │
│          │     │ Faculty  │     │  Reports     │     │  Feedback   │
└─────────┘     └──────────┘     └──────────────┘     └──────────────┘
                                                              │
                                                              ▼
                                  ┌──────────────┐     ┌─────────────┐
                                  │ Certificate  │◀────│  Faculty    │
                                  │ Generated    │     │  Approves   │
                                  │ (PDF)        │     │  Completion │
                                  └──────────────┘     └─────────────┘
```

---

## 👥 Team

Built as part of the **Software Engineering Project Management (SEPM)** course.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**DIMMS** — Streamlining internship management, one workflow at a time.

Made with ❤️ using Next.js & TypeScript

</div>
]]>
