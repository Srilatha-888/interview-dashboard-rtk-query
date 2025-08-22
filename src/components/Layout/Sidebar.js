import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiChevronRight,
  FiChevronLeft,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      {isMobile && (
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <FiX /> : <FiMenu />}
        </button>
      )}

      <div
        className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${
          isMobileOpen ? 'mobile-open' : 'mobile-closed'
        }`}
        aria-expanded={isExpanded}
        style={{
          position: isExpanded ? 'fixed' : 'relative',
          zIndex: isExpanded ? 1001 : 'auto',
          width: isExpanded ? '240px' : '60px',
          left: 0,
          top: 0,
          height: '100vh',
          background: '#333',
          transition: 'width 0.3s, box-shadow 0.3s',
          boxShadow: isExpanded ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {!isMobile && (
          <button
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        )}

        <h2 style={{ textAlign: 'center', margin: '16px 0' }}>{isExpanded ? 'InterviewApp' : 'IA'}</h2>

        <nav>
          <Link to="/dashboard" className="sidebar-link" aria-label="Dashboard">
            <FiHome size={20} />
            {isExpanded && <span style={{ marginLeft: 8 }}>Dashboard</span>}
          </Link>

          <Link to="/profile" className="sidebar-link" aria-label="Profile">
            <FiUser size={20} />
            {isExpanded && <span style={{ marginLeft: 8 }}>Profile</span>}
          </Link>

          <button className="sidebar-link logout-btn" onClick={handleLogout} aria-label="Logout">
            <FiLogOut size={20} />
            {isExpanded && <span style={{ marginLeft: 8 }}>Logout</span>}
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
