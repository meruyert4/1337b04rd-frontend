import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import Profile from '../Profile/Profile';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getCurrentPage = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/posts') return 'posts';
    if (location.pathname === '/my-posts') return 'my-posts';
    if (location.pathname === '/archive') return 'archive';
    return 'home';
  };

  const currentPage = getCurrentPage();

  return (
    <header className="transparent-header">
      <div className="logo">
        <Link to="/">1337b04rd</Link>
      </div>
      
      <nav>
        <Link to="/" className={currentPage === 'home' ? 'active' : ''}>Home</Link>
        <Link to="/posts" className={currentPage === 'posts' ? 'active' : ''}>Catalog</Link>
        <Link to="/my-posts" className={currentPage === 'my-posts' ? 'active' : ''}>My Posts</Link>
        <Link to="/archive" className={currentPage === 'archive' ? 'active' : ''}>Archive</Link>
      </nav>

      <div className="header-actions">
        <Profile />
      </div>
    </header>
  );
};

export default Header;
