import { Routes, Route, Navigate } from 'react-router-dom';

// Protected Route Guard
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import ManagerLayout from '../layouts/ManagerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Employee Pages
import EmployeeDashboardPage from '../pages/employee/EmployeeDashboardPage';
import EmployeeProfilePage from '../pages/employee/EmployeeProfilePage';
import EmployeeSkillsPage from '../pages/employee/EmployeeSkillsPage';
import EmployeeQualificationsPage from '../pages/employee/EmployeeQualificationsPage';
import ResumeManagerPage from '../pages/employee/ResumeManagerPage';
import ProjectExplorePage from '../pages/employee/ProjectExplorePage';
import EmployeeApplicationsPage from '../pages/employee/EmployeeApplicationsPage';
import EmployeeMatchesPage from '../pages/employee/EmployeeMatchesPage';

// Manager Pages
import ManagerDashboardPage from '../pages/manager/ManagerDashboardPage';
import ManagerProfilePage from '../pages/manager/ManagerProfilePage';
import ManagerProjectsPage from '../pages/manager/ManagerProjectsPage';
import CreateProjectPage from '../pages/manager/CreateProjectPage';
import ProjectDetailsPage from '../pages/manager/ProjectDetailsPage';
import ProjectMatchCandidatesPage from '../pages/manager/ProjectMatchCandidatesPage';
import ProjectApplicationsPage from '../pages/manager/ProjectApplicationsPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUserManagementPage from '../pages/admin/AdminUserManagementPage';

// Landing Page
import LandingPage from '../pages/LandingPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Employee Portal Routes */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboardPage />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
          <Route path="skills" element={<EmployeeSkillsPage />} />
          <Route path="qualifications" element={<EmployeeQualificationsPage />} />
          <Route path="resume" element={<ResumeManagerPage />} />
          <Route path="projects" element={<ProjectExplorePage />} />
          <Route path="applications" element={<EmployeeApplicationsPage />} />
          <Route path="matches" element={<EmployeeMatchesPage />} />
        </Route>
      </Route>

      {/* Protected Manager Portal Routes */}
      <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboardPage />} />
          <Route path="profile" element={<ManagerProfilePage />} />
          <Route path="projects" element={<ManagerProjectsPage />} />
          <Route path="projects/new" element={<CreateProjectPage />} />
          <Route path="projects/:id" element={<ProjectDetailsPage />} />
          <Route path="projects/:id/candidates" element={<ProjectMatchCandidatesPage />} />
          <Route path="projects/:id/applications" element={<ProjectApplicationsPage />} />
        </Route>
      </Route>

      {/* Protected Admin Portal Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUserManagementPage />} />
        </Route>
      </Route>

      {/* Fallback Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
