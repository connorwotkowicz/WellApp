'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { usePathname } from 'next/navigation'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Search, Home } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const defaultProfilePic = '/default-profile.png';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); 

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileTimeout = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const { user, logout } = useContext(AuthContext);  
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const content = document.querySelector('.page-content');
    if (content) {
      content.classList.remove('blurred');
      document.body.style.overflow = 'auto';
    }
  }, [pathname]);

  
  if (pathname?.startsWith("/admin")) {
    return null; 
  }

  return (
    <>
      <nav className='navbar'>
        <div className='nav-container'>
          <div className='nav-left'>
         <Link href='/' className='nav-logo'>
  <span className="logo-full">WellnessApp</span>
  <span className="logo-short">w2k25</span>
</Link>

          </div>

          <div className='nav-m-right'>
   <div className='nav-m-right'>
 <Link href='/' className='home-link' aria-label='Go to Home'>
    <Home className="home-icon" />
  </Link>
  <Link href='/services' className='nav-link'>Services</Link>
  <Link href='/bookings' className='nav-link'>Bookings</Link>
  <Link href='/providers' className='nav-link'>Providers</Link>
</div>
          </div>

        <div className='nav-right'>
      

            <button className='theme-toggle-button' onClick={toggleTheme} aria-label='Toggle Theme'>
              {theme === 'dark' ? '☀︎' : '☾'}
            </button>

            {user ? (
              <div
                className='account-dropdown'
                onMouseEnter={() => {
                  if (profileTimeout.current) clearTimeout(profileTimeout.current);
                  setProfileDropdownVisible(true);
                }}
                onMouseLeave={() => {
                  profileTimeout.current = setTimeout(() => {
                    setProfileDropdownVisible(false);
                  }, 200);
                }}
                ref={profileRef}
              >
                <img
                  src={user.profilePic || defaultProfilePic}
                  alt='Profile'
                  className='account-avatar'
                />
                <div className={`account-dropdown-menu ${profileDropdownVisible ? 'show' : ''}`}>
                  <Link href='/account' className='dropdown-link'>Account</Link>
                  {user.user_role === 'admin' && (
                    <Link href='/admin' className='dropdown-link'>Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className='dropdown-link logout-button'>Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link href='/login' className='nav-button'>Login</Link>
                <Link href='/register' className='nav-button'>Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
