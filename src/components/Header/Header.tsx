import React from 'react';
import './Header.css';

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage = 'home' }) => {
  return (
    <header className="transparent-header">
      <div className="logo">1337b04rd</div>
      <nav>
        <a href="/" className={currentPage === 'home' ? 'active' : ''}>Home</a>
        <a href="/posts" className={currentPage === 'posts' ? 'active' : ''}>Catalog</a>
        <a href="/archive" className={currentPage === 'archive' ? 'active' : ''}>Archive</a>
      </nav>
    </header>
  );
};

export default Header;
