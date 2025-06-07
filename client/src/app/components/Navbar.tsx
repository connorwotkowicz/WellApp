'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../utils/useTheme';
import SearchBar from './SearchBar';

const defaultProfilePic = '/default-profile.png';

interface NavbarProps {
  isAuthenticated: boolean;
  onSearch?: (query: string) => void;
  allItems?: any[];
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onSearch, allItems = [] }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileTimeout = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
    setDropdownVisible((prev) => !prev);
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
      content.classList.toggle('blurred', isSearchVisible);
      document.body.style.overflow = isSearchVisible ? 'hidden' : 'auto';
    }
  }, [isSearchVisible]);

  useEffect(() => {
    const content = document.querySelector('.page-content');
    if (content) content.classList.remove('blurred');
    document.body.style.overflow = 'auto';
  }, [pathname]);

  const closeSearchImmediately = () => {
    setSearchVisible(false);
    setDropdownVisible(false);
    const content = document.querySelector('.page-content');
    if (content) content.classList.remove('blurred');
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <nav className='navbar'>
        <div className='nav-container'>
          <div className='nav-left'>
            <Link href='/' className='nav-logo'>WellnessApp</Link>
          </div>

          <div className='nav-right'>
            <button className='nav-button-search-icon' onClick={toggleSearch} aria-label='Toggle Search'>
              <Search size={16} />
            </button>

            <button className='theme-toggle-button' onClick={toggleTheme} aria-label='Toggle Theme'>
              {theme === 'dark' ? '☀︎' : '☾'}
            </button>

            {isAuthenticated ? (
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
                  src={(user?.profilePic as string) || defaultProfilePic}
                  alt='Profile'
                  className='account-avatar'
                />
                {profileDropdownVisible && (
                  <div className='account-dropdown-menu show'>
                    <Link href='/account' className='dropdown-link'>Account</Link>
                    {user?.user_role === 'admin' && (
                      <Link href='/admin/dashboard' className='dropdown-link'>Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className='dropdown-link logout-button'>Logout</button>
                  </div>
                )}
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

      {isSearchVisible && (
        <div className='nav-search-dropdown'>
          <div className='search-inner'>
            <SearchBar
              onSearch={onSearch ?? (() => {})}
              allItems={allItems}
              onCloseSearch={closeSearchImmediately}
            />
          </div>
        </div>
      )}

      {isDropdownVisible && (
        <div className='dropdown show'>
          <div className='dropdown-links'></div>
        </div>
      )}
    </>
  );
};

export default Navbar;
