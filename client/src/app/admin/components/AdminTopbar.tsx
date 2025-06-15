'use client';

import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; 
import Link from "next/link";
import { Home } from "lucide-react";


const AdminTopbar: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const profileTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleProfileDropdown = () => {
    clearTimeout(profileTimeout.current as ReturnType<typeof setTimeout>);
    setProfileOpen((prev) => !prev);
  };

  const delayedCloseProfile = () => {
    profileTimeout.current = setTimeout(() => setProfileOpen(false), 300);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="admin-topbar">
      <div className="admin-header-left">
        <h1 className="admin-header-title">Admin Dashboard</h1>

      </div>

      <div className="admin-header-tools">
        <Link href="/" className="dropdown-item" aria-label="Go to Home">Home</Link>

        <div
          className="profile-dropdown"
          onMouseLeave={delayedCloseProfile}
          onMouseEnter={() => clearTimeout(profileTimeout.current as ReturnType<typeof setTimeout>)}
        >
          <div 
            className="admin-avatar" 
            onClick={toggleProfileDropdown} 
            aria-expanded={profileOpen ? "true" : "false"}
            aria-label="Profile menu"
          >
            <img
              src={user?.profilePic || "/default-profile.png"}
              alt="Avatar"
              className="avatar-img"
            />
          </div>

          {profileOpen && (
            <div className="profile-dropdown-menu">
              <Link href="/" className="dropdown-item" aria-label="Go to Home">Home</Link>
              <button 
                onClick={handleLogout} 
                className="dropdown-item" 
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
