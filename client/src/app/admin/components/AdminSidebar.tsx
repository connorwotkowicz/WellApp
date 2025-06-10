import React, { useState } from "react";
import Link from "next/link";

interface User {
  name?: string;
  user_role?: string;
}

interface AdminSidebarProps {
  user: User;
   isOpen: boolean; 
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
     
      <button className="hamburger-menu" onClick={toggleSidebar}>
        ☰
      </button>

   
      <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
        <h2 className="admin-title">{user?.name || "Admin"}</h2>
        <nav className="admin-nav">
           
        <Link href="/admin" aria-label="Go back to Dashboard"className="admin-link">Dashboard</Link>
      
          <Link href="/admin/providers" className="admin-link">
            Manage Providers
          </Link>
          <Link href="/admin/services" className="admin-link">
            Manage Services
          </Link>
          <Link href="/admin/users" className="admin-link">
            Manage Users
          </Link>
          <Link href="/admin/bookings" className="admin-link">
            Manage Bookings
          </Link>
        </nav>
      </aside>
    </div>
  );
};

export default AdminSidebar;
