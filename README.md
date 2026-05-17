# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built using the MERN stack with TypeScript, following clean architecture, scalable code practices, and a modern SaaS-style user experience.

---

## 📌 Project Overview

Smart Leads Dashboard is a web application that allows users to:

* Manage leads efficiently (CRUD operations)
* Perform advanced filtering and searching
* Use secure authentication (JWT-based)
* Export data (CSV)
* Access features based on user roles

---

## 🌐 Deployment

Frontend: https://smart-leads-dashboard-pink-ten.vercel.app/
Backend: https://smart-leads-dashboard-1-4rxk.onrender.com/

## 🛠 Tech Stack

### Frontend

* React.js
* TypeScript
* TailwindCSS
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose

### Other Tools

* JWT Authentication
* bcrypt (password hashing)
* Docker

---

## 🔐 Features

### Authentication

* User Registration
* User Login
* JWT-based authentication
* Protected routes
* Password hashing using bcrypt

---

### 📊 Leads Management

* Create Lead
* View Leads List
* View Single Lead
* Update Lead
* Delete Lead

---

### 🔍 Advanced Filtering & Search

* Filter by Status
* Filter by Source
* Search by Name or Email
* Sort by Latest / Oldest
* Multiple filters combined

---

### 📄 Pagination

* Backend pagination implemented
* Limit: 10 records per page
* Includes metadata:

  * total
  * page
  * totalPages

---

### ⚡ Additional Features

* Debounced Search (optimized API calls)
* CSV Export functionality
* Role-Based Access Control (Admin / Sales)
* Docker setup for full project

---

### 🎨 UI/UX Features

* Responsive Design
* Clean Dashboard Layout
* Reusable Components
* Loading States
* Error Handling UI
* Empty States ("No leads found")

---

## 🔑 Role-Based Access

### Admin

* Full access (Create, Update, Delete)

### Sales

* Can view leads
* Can create leads
* Restricted actions (e.g., delete disabled)

---

## 📦 API Endpoints

### Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`

### Leads Routes

* `GET /api/leads`
* `GET /api/leads/:id`
* `POST /api/leads`
* `PUT /api/leads/:id`
* `DELETE /api/leads/:id`

### Export Route

* `GET /api/leads/export`

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-leads-dashboard.git
cd smart-leads-dashboard
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🐳 Docker Setup

Run the full project using Docker:

```bash
docker-compose up --build
```

---

## 🌐 Deployment

Frontend: (Add your deployed frontend link)
Backend: (Add your deployed backend link)

---

## 🧪 Testing

Tested Features:

* Authentication (Register/Login)
* CRUD Operations
* Filtering and Search
* Pagination
* Role-Based Access
* CSV Export

---

## 📄 .env.example

```env
PORT=
MONGO_URI=
JWT_SECRET=
```

---

## 👤 Author

**Kowsika Devi**

---

## 📬 Submission

**Subject:** MERN Internship Assignment Submission - Kowsika Devi
**Email:** [ritik.yadav@servicehive.tech](mailto:ritik.yadav@servicehive.tech)

---

## ⭐ Notes

* Built with clean and scalable architecture
* Proper TypeScript usage (no unnecessary `any`)
* Follows real-world engineering practices
* Focused on performance and user experience

---
