# 🎓 DIMMS

### 🚀 Digital Internship & Mentorship Management System

> A powerful full-stack platform to streamline internship workflows between **Students 👨‍🎓, Mentors 👨‍💼, Faculty 👩‍🏫, and Admins 🛡️**

---

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ Highlights

- 🔐 Role-Based Dashboards
- 📊 Full Internship Lifecycle Tracking
- 🤖 AI-Powered Feedback System
- 🏆 Auto Certificate Generation (PDF)
- 🌌 Stunning Aurora UI + Glassmorphism

---

## 🔐 Role-Based Access

| 🧑‍💼 Role | 📍 Dashboard | ⚙️ What They Can Do |
|----------|-------------|---------------------|
| 🛡️ **Admin** | `/admin` | Manage users, programs, internships |
| 🎓 **Student** | `/student` | Submit tasks, reports, download certificates |
| 👨‍💼 **Mentor** | `/mentor` | Assign tasks, review work, give feedback |
| 👩‍🏫 **Faculty** | `/faculty` | Monitor progress, approve completion |

---

## 📋 Internship Workflow

```
Admin Creates Program
        ↓
Assigns Student + Mentor + Faculty
        ↓
Student Completes Tasks & Reports
        ↓
Mentor Reviews & Recommends
        ↓
Faculty Approves Completion
        ↓
🏆 Certificate Generated (PDF)
```

---

## 🤖 AI Features

- 🧠 Report Quality Analysis
- ✍️ Smart Feedback (multiple tones)
- 📈 Performance Suggestions

---

## 🏆 Certificate System

- 🖤 Luxury Gold + Black Design
- ✨ Auto-filled student & program details
- 📄 Instant PDF Download

---

## 🌌 UI Experience

- 🌈 Aurora Animated Background
- ✨ Glassmorphism Layout
- 💎 Fully immersive dashboards

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| ⚙️ Framework | Next.js 16 (App Router, Turbopack) |
| 💻 Language | TypeScript 5 |
| 🎨 Styling | Tailwind CSS v4 |
| 🧩 UI | shadcn/ui (Radix) |
| 🎞️ Animations | Framer Motion |
| 📄 PDF | html2pdf.js |
| 📊 Analytics | Vercel Analytics |
| 🗄️ Database | Mock In-Memory DB |

---

## 📁 Project Structure

```
ims/
├── app/
│   ├── layout.tsx          # Root layout + Aurora background
│   ├── page.tsx            # Landing page
│   ├── login/              # Auth page
│   ├── admin/              # Admin dashboard
│   ├── student/            # Student dashboard
│   ├── mentor/             # Mentor dashboard
│   └── faculty/            # Faculty dashboard
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Protected layout + header
│   ├── admin/              # Admin modals
│   ├── student/            # Certificate, tasks, reports
│   ├── mentor/             # Task creation, feedback
│   └── faculty/            # Approval modal
├── lib/
│   ├── mock-db.ts          # In-memory database
│   ├── auth.ts             # Auth utilities
│   ├── ai-analysis.ts      # AI report analysis
│   └── utils.ts            # Helpers
└── package.json
```

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone git@github.com:Vansh-Gokhale/DIMMS.git
cd DIMMS

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **[http://localhost:3009](http://localhost:3009)** 🎉

---

## 🔑 Demo Credentials

| 🧑‍💼 Role | 📧 Email | 🔒 Password |
|----------|---------|-------------|
| 🛡️ **Admin** | `admin@dimms.com` | `admin123` |
| 🎓 **Student** | `student@example.com` | `student123` |
| 👨‍💼 **Mentor** | `mentor@example.com` | `mentor123` |
| 👩‍🏫 **Faculty** | `faculty@university.edu` | `faculty123` |

> 💡 **Tip:** Try all four roles to explore the complete platform!

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 👥 Team

Built as part of the **Software Engineering Project Management (SEPM)** course.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**DIMMS** — Streamlining internship management, one workflow at a time ✨

Made with ❤️ using Next.js & TypeScript

</div>
