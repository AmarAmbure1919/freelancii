// components/Appbar.jsx
"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Menu,
  Grid,
  Settings,
  LogOut,
  Moon,
  Sun,
  CreditCard,
  Clock,
  Users,
  Briefcase,
  Plus
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Appbar.css';

const Appbar = () => {
  const { isExpanded } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', icon: <Grid size={18} />, path: '/', id: 'dashboard' },
    { name: 'Clients', icon: <Users size={18} />, path: '/clients', id: 'clients' },
    { name: 'Projects', icon: <Briefcase size={18} />, path: '/projects', id: 'projects' },
    { name: 'Payments', icon: <CreditCard size={18} />, path: '/payments', id: 'payments' },
    { name: 'Expenses', icon: <LogOut size={18} />, path: '/expenses', id: 'expenses' },
    { name: 'Time', icon: <Clock size={18} />, path: '/time', id: 'time' }
  ];

  const newMenuItems = [
    { name: 'New Client', icon: <Users size={16} />, path: '/new-client' },
    { name: 'New Project', icon: <Briefcase size={16} />, path: '/new-project' },
    { name: 'New Invoice', icon: <CreditCard size={16} />, path: '/new-invoice' },
    { name: 'New Expense', icon: <LogOut size={16} />, path: '/new-expense' }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add dark mode logic here
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    router.push('/login');
  };

  return (
    <div className={`appbar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="appbar-left">
          <button className="menu-toggle" onClick={() => console.log('Menu toggle clicked')}>
            <Menu size={20} />
          </button>
          
          {/* Search Bar */}
          <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={handleSearch}
            />
            <div className="search-shortcut">⌘K</div>
          </div>
        </div>

        <div className="appbar-right">
          {/* Dark Mode Toggle */}
          <button className="icon-button theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button 
            className="icon-button notification-bell"
            onClick={() => router.push('/notifications')}
          >
            <Bell size={18} />
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </button>

          {/* User Profile */}
          <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar">
              <User size={16} />
            </div>
            <div className="user-info">
              <span className="user-name">Alex Morgan</span>
              <span className="user-role">Admin</span>
            </div>
            <ChevronDown size={16} className={`user-arrow ${showUserMenu ? 'rotated' : ''}`} />
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="navigation-bar">
        <div className="nav-items">
          {navigationItems.map((item) => (
            <Link href={item.path} key={item.id} style={{ textDecoration: 'none' }}>
              <button
                className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
                {pathname === item.path && <div className="nav-glow"></div>}
              </button>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            onClick={() => setShowNewMenu(!showNewMenu)}
          >
            <span className="quick-action-icon">+</span>
            <span className="quick-action-text">New</span>
          </button>
          
          {/* New Menu Dropdown */}
          {showNewMenu && (
            <div className="new-dropdown">
              {newMenuItems.map((item, index) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={() => {
                    router.push(item.path);
                    setShowNewMenu(false);
                  }}
                >
                  <span className="dropdown-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-user-info">
              <strong>Alex Morgan</strong>
              <span>alex@nexus.com</span>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item"
            onClick={() => {
              router.push('/profile');
              setShowUserMenu(false);
            }}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button 
            className="dropdown-item"
            onClick={() => {
              router.push('/settings');
              setShowUserMenu(false);
            }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <div className="dropdown-divider"></div>
          <button 
            className="dropdown-item logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Appbar;