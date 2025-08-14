import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        width: isExpanded ? '200px' : '60px',
        transition: 'width 0.3s ease',
        backgroundColor: '#2c3e50',
        height: '100vh',
        padding: '10px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isExpanded ? 'flex-start' : 'center'
      }}
    >
      <h2 style={{ fontSize: '18px', marginBottom: '20px', whiteSpace: 'nowrap' }}>
        {isExpanded ? 'InterviewApp' : 'IA'}
      </h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
        <Link to="/dashboard" style={linkStyle}>
          <FiHome size={20} />
          {isExpanded && <span style={{ marginLeft: '10px' }}>Dashboard</span>}
        </Link>

        <Link to="/profile" style={linkStyle}>
          <FiUser size={20} />
          {isExpanded && <span style={{ marginLeft: '10px' }}>Profile</span>}
        </Link>

        <button
          onClick={handleLogout}
          style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
        >
          <FiLogOut size={20} />
          {isExpanded && <span style={{ marginLeft: '10px' }}>Logout</span>}
        </button>
      </nav>
    </div>
  );
};

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  textDecoration: 'none',
  padding: '8px 10px',
  borderRadius: '5px',
  transition: 'background 0.2s',
};

export default Sidebar;
