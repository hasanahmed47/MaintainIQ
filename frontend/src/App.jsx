import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './pages/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminAssets from './pages/AdminAssets';
import AdminIssues from './pages/AdminIssues';
import AdminTeam from './pages/AdminTeam';
import TechnicianDashboard from './pages/TechnicianDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import PublicAssetPage from './pages/PublicAssetPage';
import AssetDetails from './pages/AssetDetails';
import PrivateRoute from './routes/PrivateRoute';

const ROLE_HOME = {
  admin: '/admin',
  supervisor: '/supervisor',
  technician: '/technician',
};

const AUTH_PATHS = ['/login', '/signup'];

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const homeRoute = userInfo ? ROLE_HOME[userInfo.role] || '/login' : '/login';
  const transitionKey = AUTH_PATHS.includes(location.pathname) ? location.pathname : 'app';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={transitionKey}>
        <Route path="/" element={<Navigate to={homeRoute} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/asset/:assetCode" element={<PublicAssetPage />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="assets" element={<AdminAssets />} />
          <Route path="issues" element={<AdminIssues />} />
          <Route path="team" element={<AdminTeam />} />
        </Route>

        <Route
          path="/admin/asset/:id"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AssetDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/technician"
          element={
            <PrivateRoute allowedRoles={['technician']}>
              <TechnicianDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/supervisor"
          element={
            <PrivateRoute allowedRoles={['supervisor']}>
              <SupervisorDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;