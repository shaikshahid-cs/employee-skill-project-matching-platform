import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ManagerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar
        portalName="Manager"
        onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
      />
      <Sidebar
        portal="manager"
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
