import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import './Sidebar.css';

const Sidebar = ({ navItems }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="sidebar-brand">
        <span className="brand-dot" />
        MaintainIQ
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) =>
          item.path ? (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ) : (
            <button
              key={item.key}
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <span className="user-avatar">{userInfo?.name?.charAt(0) || 'U'}</span>
          <div className="user-meta">
            <span className="user-name">{userInfo?.name}</span>
            <span className="user-role">{userInfo?.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;