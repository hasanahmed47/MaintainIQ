import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import './AdminLayout.css';

const navItems = [
  { key: 'overview', label: 'Overview', path: '/admin', end: true },
  { key: 'assets', label: 'Assets', path: '/admin/assets' },
  { key: 'issues', label: 'Issues', path: '/admin/issues' },
  { key: 'team', label: 'Team', path: '/admin/team' },
];

const AdminLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar navItems={navItems} />
      <main className="dashboard-main">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;