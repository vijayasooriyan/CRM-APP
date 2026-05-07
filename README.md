# 🏆 FireCRM: Full-Stack Lead Management System

> **Intern Developer Assessment Submission**
> A production-ready CRM built to demonstrate full-stack architecture, secure authentication, and advanced data auditing.

## 🔗 Live Links
- **Deployed Application**: [https://crm-app-ten-delta.vercel.app](https://crm-app-ten-delta.vercel.app)
- **Demo Video**: [Link to Loom/YouTube Video Here]
- **API Health Check**: [https://crm-app-mxs0.onrender.com/api/health](https://crm-app-mxs0.onrender.com/api/health)

---

## 📖 Project Overview
FireCRM is a specialized Lead Management System designed for small sales teams. It streamlines the lifecycle of a lead from initial contact to a "Won" deal. Unlike a simple database, FireCRM includes **Lead Scoring** to help sales reps prioritize their day and an **Activity Audit Log** to ensure every interaction is tracked.

### Core Deliverables Met:
- [x] **Secure Authentication**: JWT-based login with HTTP-Only Cookies.
- [x] **Full CRUD**: Lead creation, updates, notes, and deletion.
- [x] **Dynamic Dashboard**: Aggregated metrics for sales performance.
- [x] **Search & Filter**: Advanced filtering by status, source, and assigned user.
- [x] **Persistence**: MongoDB Atlas integration.

---

## 🛠 Tech Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js, Cookie-Parser |
| **DevOps** | GitHub Actions (CI/CD), Vercel (Frontend), Render (Backend) |

---

## 🌟 Bonus Features (Product Thinking)
To improve the CRM for real-world sales teams, I implemented:
1.  **Lead Scoring Engine**: A proprietary algorithm that assigns a 0-100 score based on deal value, source credibility, and current status.
2.  **Automated Activity Audit**: A Mongoose middleware that automatically logs every status change or note addition into a "Timeline" view.
3.  **Stale Lead Detection**: Visual flags for leads that have been inactive for more than 14 days.
4.  **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions to ensure code quality.

---

## ⚙️ How to Run Locally

### 1. Prerequisites
- Node.js (v20+)
- A MongoDB Connection String (Atlas or Local)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET
npm run seed  # CRITICAL: Creates the test admin user
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Set VITE_API_URL to http://localhost:5000/api
npm run dev
```

---

## 🔐 Test Login Credentials
| Field | Value |
| :--- | :--- |
| **Email** | `admin@example.com` |
| **Password** | `password123` |

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret for token signing.
- `FRONTEND_URL`: URL for CORS allow-listing.
- `NODE_ENV`: Set to `production` or `development`.

### Frontend (`/frontend/.env`)
- `VITE_API_URL`: Backend API URL (e.g., `http://localhost:5000/api`).

---

## 🗄 Database Setup
The project uses **MongoDB**. 
1.  **Schema**: Defined using Mongoose in `backend/src/models/`.
2.  **Indexing**: Text indexes are used on `leadName`, `companyName`, and `email` for high-performance search.
3.  **Seeding**: Use `npm run seed` in the backend directory to populate the database with the required test user and sample leads.

---

## ⚠️ Known Limitations
- **Concurrency**: Basic locking for lead updates is not implemented.
- **Attachments**: The current version does not support PDF or image uploads for leads.
- **Email Notifications**: Alerts are currently UI-only and do not send external SMTP emails.

---

## 🧠 Reflection
Building FireCRM was an exercise in managing **Cross-Origin security**. Deploying a MERN app across different providers (Vercel & Render) required a deep dive into **CORS preflight requests** and **SameSite cookie attributes**. 

One design decision I am proud of is the **Dynamic Lead Scoring**. Instead of just showing a list, the app helps a salesperson decide *who to call first*. This "Product Thinking" approach transforms a simple CRUD app into a useful business tool.

---
**Author**: [Vijayasooriyan Kamarajah](https://github.com/vijayasooriyan)
