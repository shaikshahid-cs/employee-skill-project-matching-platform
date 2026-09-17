import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar
        portalName="Admin"
        onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
      />
      <Sidebar
        portal="admin"
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
