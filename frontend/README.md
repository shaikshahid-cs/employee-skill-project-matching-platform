# Employee Matching Platform — Frontend Application

A modern, high-performance, dark-slate SaaS application built with **React 19**, **Vite 8**, **React Router DOM 7**, and **Axios**. The frontend provides multi-role portals for **Employees**, **Managers**, and **Admins**, fully integrated with a **Spring Boot** backend REST API and **MySQL** database.

---

## 🌟 Architecture Overview

- **Single Page Application (SPA)**: Powered by Vite 8 & React 19.
- **Routing & Role Protection**: React Router v7 with declarative `<ProtectedRoute>` role guards (`EMPLOYEE`, `MANAGER`, `ADMIN`).
- **State & Authentication**: Context API (`AuthContext`) managing JWT session state, user context, and token persistence in `localStorage`.
- **API Infrastructure**: Centralized Axios client (`src/api/axiosClient.js`) with passive Bearer token injection and global 401 interception (`auth:unauthorized` custom event).
- **Design System**: Responsive dark slate SaaS UI styling (`#0b0f19` background, `#6366f1` primary indigo accents) built with Vanilla CSS tokens (`src/index.css`) and Lucide React icons.

---

## 🔐 Role Structure & Authorization

1. **Employee Portal (`/employee/*`)**:
   - Profile management (`department`, `designation`, `experience`).
   - Skill catalog search & proficiency rating (scale 1–10).
   - Certification and Education records CRUD.
   - Resume document upload (`.pdf`, `.docx`, `.doc`, `.txt` <= 5MB) & automated skill extraction parser.
   - Open project discovery & personalized project recommendations.
   - Application submission & application status feed (`PENDING`, `ACCEPTED`, `REJECTED`).
   - Personal candidate match scores & granular score breakdown.
2. **Manager Portal (`/manager/*`)**:
   - Manager profile details.
   - Project requisition creation & management.
   - Required project skills matrix configuration (proficiency 1–5, importance 1–5).
   - Job Description document upload (`.pdf`, `.docx`, `.doc`, `.txt` <= 5MB) & automated skill extraction parser.
   - Candidate matching engine calculation trigger & candidate match list with score explanation modal.
   - Application review management (`ACCEPTED` / `REJECTED`).
   - Real manager dashboard stats derived live from backend.
3. **Admin Portal (`/admin/*`)**:
   - System platform statistics (8 real backend metrics: users, employees, managers, projects, open projects, applications, skills, match results).
   - User directory listing & user account detail inspection modal.

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Spring Boot Backend**: Running locally on `http://localhost:8080` (or production API host)
- **MySQL Database**: `jdbc:mysql://localhost:3306/employee_matching_1`

---

## 🚀 Development Quickstart

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   *The dev server runs on `http://localhost:5173`. API requests to `/api/*` are automatically proxied via Vite to `http://localhost:8080`.*

3. **Code Quality & Linting**:
   ```bash
   npm run lint
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## ⚙️ Environment Configuration (`VITE_API_BASE_URL`)

API communication uses a single, centralized Axios client (`src/api/axiosClient.js`) that dynamically resolves the base API URL at build time:

```javascript
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

### Environment Workflows
- **Development**: Defaults to `/api` (proxied by Vite to `http://localhost:8080`).
- **Production**: Supplied via `VITE_API_BASE_URL` environment variable during build (e.g. `VITE_API_BASE_URL=/api` or `VITE_API_BASE_URL=https://api.yourdomain.com/api`).

> **Note**: `VITE_API_BASE_URL` is a Vite build-time environment variable. To change the target API endpoint for production, rebuild the application using `VITE_API_BASE_URL=<URL> npm run build`.

Refer to `.env.example` for environment variable templates. Never commit real production secrets or private credentials to source control.

---

## 📁 File Upload Specifications

- **Supported File Formats**: **`.pdf`**, **`.docx`**, **`.doc`**, **`.txt`**
- **Maximum Application Upload Size**: **5 MB** (`5 * 1024 * 1024` bytes)
- **Multipart Form Field Name**: `file`

---

## 🖥️ Backend Deployment Requirements (Manual / Deployment Step)

For production deployment of the Spring Boot backend service, deployment engineers must ensure:

1. **Production CORS Configuration**: Update `SecurityConfig.java` to allow the production frontend origin domain (via property `app.cors.allowed-origins`).
2. **Persistent Upload Storage**: Mount a persistent volume to `uploads/resumes` and `uploads/job-descriptions` so server restarts do not erase uploaded documents.
3. **Reverse Proxy Request Limit**: Set Nginx or web-server `client_max_body_size 10M;` to provide deliberate headroom for 5 MB multipart HTTP request boundaries.

---

## 📄 License & Ownership

Confidential and Proprietary. Employee Matching Platform Project © 2026.
