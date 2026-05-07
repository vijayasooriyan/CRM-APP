# 🚀 FireCRM: Professional Lead Management System

FireCRM is a high-performance, full-stack CRM platform designed to streamline sales pipelines, track lead engagement, and provide actionable analytics. Built with the **MERN stack**, it features a sophisticated lead scoring engine, automated activity auditing, and real-time dashboard metrics.

![Dashboard Preview](https://via.placeholder.com/1200x600/060810/FF5B14?text=FireCRM+Dashboard+Interface)

## 📑 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [CI/CD & Deployment](#cicd--deployment)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Lead Scoring Logic](#lead-scoring-logic)
- [Known Limitations](#known-limitations)
- [Reflection](#reflection)

---

## 🧐 Overview
FireCRM was built to solve the "stale lead" problem in modern sales teams. It doesn't just store data; it analyzes it. By calculating a dynamic **Lead Score (0-100)** based on deal value and engagement, sales teams can prioritize the most valuable prospects instantly.

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (Vanilla CSS variables for custom theming)
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB (Mongoose ODM)
- **Deployment**: Vercel (Frontend), Render (Backend)
- **CI/CD**: GitHub Actions

---

## ✨ Key Features
- **📊 Advanced Analytics Dashboard**: Real-time tracking of Open Deals, Conversion Rates, and Projected Revenue.
- **🎯 Smart Lead Scoring**: Custom algorithm that scores leads based on status, source, and deal value.
- **🕒 Activity Audit Log**: Every change (status update, note added) is automatically logged with a timestamp.
- **🚩 Stale Lead Detection**: System automatically flags leads that haven't been contacted in 14+ days.
- **🔐 Secure Auth**: JWT-based authentication with secure, HTTP-only cookies for production.
- **📱 Responsive UI**: Premium dark-mode aesthetic designed for high-resolution displays.

---

## 🏗 CI/CD & Deployment
This project uses a modern automated pipeline:
- **GitHub Actions**: On every push to `main`, the system runs a CI job to install dependencies and verify the build.
- **Backend (Render)**: Automatically redeploys when the GitHub build passes.
- **Frontend (Vercel)**: Global CDN deployment with custom SPA routing (`vercel.json`).
- **Dynamic CORS**: Backend automatically trusts any `.vercel.app` deployment, ensuring seamless login across preview environments.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install
```bash
git clone https://github.com/vijayasooriyan/CRM-APP.git
cd CRM-APP
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI
npm run seed  # Creates the admin user
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 🔑 Test Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)
| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Connection string for MongoDB Atlas |
| `JWT_SECRET` | Secret key for signing tokens |
| `FRONTEND_URL` | The URL of your live frontend (for CORS) |
| `NODE_ENV` | Set to `production` in live environments |

### Frontend (`/frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | The URL of your backend API (ending in /api) |

---

## 🎯 Lead Scoring Logic
The **Lead Score** is a proprietary virtual field in the Mongoose model:
- **Base Score**: Depends on `status` (e.g., `Qualified` = 50, `Proposal Sent` = 80).
- **Multiplier**: High-value deals (`>$50,000`) get a +15 point boost.
- **Source Weight**: Referrals get a +10 point boost over cold emails.

---

## ⚠️ Known Limitations
- **File Uploads**: Currently, the system does not support document uploads (PDFs/Invoices).
- **Email Integration**: Follow-up notifications are internal; they do not send real emails yet.
- **Multi-tenancy**: Designed for a single organization.

---

## 🧠 Reflection
Building FireCRM taught me the critical importance of **Cross-Origin Resource Sharing (CORS)** and **Cookie Security** in production environments. The biggest challenge was ensuring that JWT cookies were correctly passed between different top-level domains (Vercel and Render). Implementing the automated Activity Logger through Mongoose middleware also highlighted how to maintain a robust data audit trail without cluttering the business logic.

---

**Built with ❤️ by [Vijayasooriyan Kamarajah](https://github.com/vijayasooriyan)**
