import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function EmployeeLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar
        portalName="Employee"
        onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
      />
      <Sidebar
        portal="employee"
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
