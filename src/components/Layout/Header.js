import React from 'react';

const Header = ({ title }) => (
  <header className="header">
    <h1>{title}</h1>
    <div className="user-avatar">👤 User</div>
  </header>
);

export default Header;
