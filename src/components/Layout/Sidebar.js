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
      >
        {!isMobile && (
          <button
            className="expand-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        )}

        <h2>{isExpanded ? 'InterviewApp' : 'IA'}</h2>

        <nav>
          <Link to="/dashboard" className="sidebar-link">
            <FiHome size={20} />
            {isExpanded && <span>Dashboard</span>}
          </Link>

          <Link to="/profile" className="sidebar-link">
            <FiUser size={20} />
            {isExpanded && <span>Profile</span>}
          </Link>

          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <FiLogOut size={20} />
            {isExpanded && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
