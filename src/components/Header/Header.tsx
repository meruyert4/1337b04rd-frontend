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
    <header className="transparent-header" data-testid="header">
      <div className="logo" data-testid="logo">
        <Link to="/" data-testid="logo-link">1337b04rd</Link>
      </div>
      
      <nav data-testid="main-navigation">
        <Link to="/" className={currentPage === 'home' ? 'active' : ''} data-testid="nav-home">Home</Link>
        <Link to="/posts" className={currentPage === 'posts' ? 'active' : ''} data-testid="nav-catalog">Catalog</Link>
        <Link to="/my-posts" className={currentPage === 'my-posts' ? 'active' : ''} data-testid="nav-my-posts">My Posts</Link>
        <Link to="/archive" className={currentPage === 'archive' ? 'active' : ''} data-testid="nav-archive">Archive</Link>
      </nav>

      <div className="header-actions" data-testid="header-actions">
        <Profile />
      </div>
    </header>
  );
};

export default Header;
