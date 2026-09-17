# 🚀 Revised Implementation Plan - Employee Matching Platform Frontend

> **Source of Truth Notice:** The Spring Boot backend codebase (`d:\fullproject\backend\employee-matching_1`) is the single source of truth. No backend modifications will be made, and no mock APIs or invented data formats will be used.

---

## Technical Audits & Architecture Decisions

### 1. Server Port & Proxy Configuration
- **Backend Audit Result:** `d:\fullproject\backend\employee-matching_1\src\main\resources\application.properties` does not specify a custom `server.port`. Therefore, Spring Boot runs on the default port **`8080`**.
- **Proxy Architecture:** Vite configuration (`vite.config.js`) will proxy all `/api` requests to `http://localhost:8080`.

### 2. Token Storage Mechanism
- **JWT Storage:** Tokens will be held in browser `localStorage` as the chosen token storage mechanism for authenticating API requests.
- **Security Note:** `localStorage` is used to persist authentication session state across page reloads; it is not claimed to provide security guarantees against client-side XSS vulnerabilities.

### 3. API Service Layer Modularization
To avoid monolithic service files, API functions are organized into **12 domain-specific service modules**:
1. `authApi.js` (Auth)
2. `employeeApi.js` (Employee Profile)
3. `employeeSkillApi.js` (Employee Skills)
4. `managerApi.js` (Manager Profile)
5. `projectApi.js` (Projects & Discovery)
6. `projectSkillApi.js` (Project Skills)
7. `jobDescriptionApi.js` (Job Description Upload & Parsing)
8. `resumeApi.js` (Resume Upload & Parsing)
9. `qualificationApi.js` (Certifications & Education)
10. `skillApi.js` (Skill Catalog Autocomplete)
11. `matchingApi.js` (Match Calculations & Explanations)
12. `applicationApi.js` (Project Applications & Review)
13. `adminApi.js` (Admin Management & Stats)

---

## Complete 47 Endpoint Mapping Inventory

| # | HTTP Method & Path | API Service File & Function | Target Page / Component |
|---|---|---|---|
| **AUTH MODULE** | | | |
| 1 | `POST /api/auth/register` | `authApi.register(dto)` | `RegisterPage` (`/register`) |
| 2 | `POST /api/auth/login` | `authApi.login(dto)` | `LoginPage` (`/login`) |
| **EMPLOYEE PROFILE MODULE** | | | |
| 3 | `POST /api/employees/profile` | `employeeApi.createProfile(dto)` | `EmployeeProfilePage` (`/employee/profile`) |
| 4 | `GET /api/employees/profile` | `employeeApi.getProfile()` | `EmployeeDashboardPage` & `EmployeeProfilePage` |
| **MANAGER PROFILE MODULE** | | | |
| 5 | `POST /api/managers/profile` | `managerApi.createProfile(dto)` | `ManagerProfilePage` (`/manager/profile`) |
| 6 | `GET /api/managers/profile` | `managerApi.getProfile()` | `ManagerDashboardPage` & `ManagerProfilePage` |
| **SKILLS CATALOG MODULE** | | | |
| 7 | `GET /api/skills` | `skillApi.searchSkills(name)` | `SkillAutocomplete` component |
| **EMPLOYEE SKILLS MODULE** | | | |
| 8 | `POST /api/employees/skills` | `employeeSkillApi.addSkill(dto)` | `EmployeeSkillsPage` (`/employee/skills`) |
| 9 | `GET /api/employees/skills` | `employeeSkillApi.getSkills()` | `EmployeeSkillsPage` (`/employee/skills`) |
| **PROJECTS MODULE** | | | |
| 10 | `POST /api/managers/projects` | `projectApi.createProject(dto)` | `CreateProjectPage` (`/manager/projects/new`) |
| 11 | `GET /api/managers/projects` | `projectApi.getManagerProjects()` | `ManagerProjectsPage` (`/manager/projects`) |
| 12 | `GET /api/projects/open` | `projectApi.getOpenProjects()` | `ProjectExplorePage` (`/employee/projects`) |
| 13 | `GET /api/projects/recommendations` | `projectApi.getRecommendedProjects()` | `EmployeeDashboardPage` (`/employee/dashboard`) |
| **PROJECT SKILLS MODULE** | | | |
| 14 | `POST /api/managers/project-skills` | `projectSkillApi.addProjectSkill(dto)` | `ProjectDetailsPage` (`/manager/projects/:id`) |
| 15 | `GET /api/managers/project-skills/project/{projectId}` | `projectSkillApi.getSkillsForProject(projectId)` | `ProjectDetailsPage` (`/manager/projects/:id`) |
| 16 | `PUT /api/managers/project-skills/{id}` | `projectSkillApi.updateProjectSkill(id, dto)` | `ProjectDetailsPage` (`/manager/projects/:id`) |
| **RESUME MODULE** | | | |
| 17 | `POST /api/employees/resume` | `resumeApi.uploadResume(formData)` | `ResumeManagerPage` (`/employee/resume`) |
| 18 | `GET /api/employees/resume` | `resumeApi.getResumes()` | `ResumeManagerPage` (`/employee/resume`) |
| 19 | `POST /api/employees/resume/{resumeId}/process` | `resumeApi.processResume(resumeId)` | `ResumeManagerPage` (`/employee/resume`) |
| **JOB DESCRIPTION MODULE** | | | |
| 20 | `POST /api/managers/projects/{projectId}/job-description` | `jobDescriptionApi.uploadJobDescription(projectId, formData)` | `ProjectDetailsPage` (`/manager/projects/:id`) |
| 21 | `GET /api/managers/projects/{projectId}/job-description` | `jobDescriptionApi.getJobDescription(projectId)` | `ProjectDetailsPage` (`/manager/projects/:id`) |
| 22 | `POST /api/managers/projects/{projectId}/job-description/process` | `jobDescriptionApi.processJobDescription(projectId)` | `ProjectDetailsPage` (`/manager/projects/:id`) |
| **QUALIFICATIONS MODULE (CERTIFICATIONS)** | | | |
| 23 | `POST /api/certifications` | `qualificationApi.addCertification(dto)` | `EmployeeQualificationsPage` (`/employee/qualifications`) |
| 24 | `GET /api/certifications` | `qualificationApi.getCertifications()` | `EmployeeQualificationsPage` (`/employee/qualifications`) |
| 25 | `GET /api/certifications/{id}` | `qualificationApi.getCertificationById(id)` | Edit Certification Modal (`/employee/qualifications`) |
| 26 | `PUT /api/certifications/{id}` | `qualificationApi.updateCertification(id, dto)` | Edit Certification Modal (`/employee/qualifications`) |
| 27 | `DELETE /api/certifications/{id}` | `qualificationApi.deleteCertification(id)` | `EmployeeQualificationsPage` (`/employee/qualifications`) |
| **QUALIFICATIONS MODULE (EDUCATION)** | | | |
| 28 | `POST /api/employees/education` | `qualificationApi.addEducation(dto)` | `EmployeeQualificationsPage` (`/employee/qualifications`) |
| 29 | `GET /api/employees/education` | `qualificationApi.getEducations()` | `EmployeeQualificationsPage` (`/employee/qualifications`) |
| 30 | `GET /api/employees/education/{id}` | `qualificationApi.getEducationById(id)` | Edit Education Modal (`/employee/qualifications`) |
| 31 | `PUT /api/employees/education/{id}` | `qualificationApi.updateEducation(id, dto)` | Edit Education Modal (`/employee/qualifications`) |
| 32 | `DELETE /api/employees/education/{id}` | `qualificationApi.deleteEducation(id)` | `EmployeeQualificationsPage` (`/employee/qualifications`) |
| **MATCHING MODULE** | | | |
| 33 | `POST /api/match-results/calculate` | `matchingApi.calculateSingleMatch(dto)` | Candidate Table on `ProjectMatchCandidatesPage` |
| 34 | `POST /api/match-results/project/{projectId}/calculate-all` | `matchingApi.calculateAllProjectMatches(projectId)` | `ProjectMatchCandidatesPage` (`/manager/projects/:id/candidates`) |
| 35 | `GET /api/match-results/my-matches` | `matchingApi.getMyMatches()` | `EmployeeMatchesPage` (`/employee/matches`) |
| 36 | `GET /api/match-results/project/{projectId}` | `matchingApi.getProjectMatches(projectId)` | `ProjectMatchCandidatesPage` (`/manager/projects/:id/candidates`) |
| 37 | `GET /api/match-results/project/{projectId}/recommended` | `matchingApi.getRecommendedCandidates(projectId)` | `ProjectMatchCandidatesPage` (`/manager/projects/:id/candidates`) |
| 38 | `GET /api/match-results/{id}` | `matchingApi.getMatchById(id)` | Match Details Modal |
| 39 | `GET /api/match-results/{id}/explanation` | `matchingApi.getMatchExplanation(id)` | `MatchExplanationModal` |
| 40 | `DELETE /api/match-results/{id}` | `matchingApi.deleteMatch(id)` | `ProjectMatchCandidatesPage` |
| **APPLICATIONS MODULE** | | | |
| 41 | `POST /api/applications` | `applicationApi.applyToProject(dto)` | `ProjectExplorePage` (`/employee/projects`) |
| 42 | `GET /api/applications/my` | `applicationApi.getMyApplications()` | `EmployeeApplicationsPage` & `EmployeeDashboardPage` |
| 43 | `GET /api/applications/project/{projectId}` | `applicationApi.getProjectApplications(projectId)` | `ProjectApplicationsPage` (`/manager/projects/:id/applications`) |
| 44 | `PUT /api/applications/{applicationId}/review` | `applicationApi.reviewApplication(id, dto)` | `ProjectApplicationsPage` |
| **ADMIN MODULE** | | | |
| 45 | `GET /api/admin/users` | `adminApi.getAllUsers()` | `AdminUserManagementPage` (`/admin/users`) |
| 46 | `GET /api/admin/users/{id}` | `adminApi.getUserById(id)` | User Detail Drawer on `AdminUserManagementPage` |
| 47 | `GET /api/admin/stats` | `adminApi.getAdminStats()` | `AdminDashboardPage` (`/admin/dashboard`) |

---

## 6-Step Feature Development Pattern

For every feature implemented across all phases, execution strictly follows this sequence:

```
Backend endpoint
    ↓
Request/response contract
    ↓
API service
    ↓
React page/component
    ↓
Real backend integration
    ↓
Real database testing
    ↓
Complete
```

---

## Controlled 10-Phase Implementation Roadmap

1. **Phase 1: React/Vite foundation** — Install dependencies (`react-router-dom`, `lucide-react`, `axios`), verify package config.
2. **Phase 2: Frontend architecture** — Directory structure, global CSS tokens, base component hierarchy setup.
3. **Phase 3: API infrastructure and backend connection** — Configure `axiosClient.js` with port `8080` Vite proxy, JWT interceptor, and 12 service modules.
4. **Phase 4: Authentication and JWT** — `AuthContext`, `LoginPage`, `RegisterPage`, and token handling.
5. **Phase 6: Shared layouts and routing** — `Navbar`, `Sidebar`, `ProtectedRoute` (role-based security guard).
6. **Phase 6: Employee module** — Implement Employee Profile, Skills, Qualifications, Resume, Project Explore, Applications, and Matches.
7. **Phase 7: Manager module** — Implement Manager Profile, Project Management, Project Skills, JD Upload/Parsing, Candidate Matching, and Application Review.
8. **Phase 8: Admin module** — Implement Admin Dashboard Stats and User Management.
9. **Phase 9: Cross-module integration** — E2E workflow integration between Employee, Manager, and Admin portals.
10. **Phase 10: Testing and production build** — Production bundle build verification and database state end-to-end testing.
