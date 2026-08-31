import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import PublicAssetPage from './pages/PublicAssetPage';
import AssetDetails from './pages/AssetDetails';
import PrivateRoute from './routes/PrivateRoute';
import { validateSession } from './redux/authSlice';

const dashboardPath = (userInfo) =>
  userInfo?.role === 'admin' ? '/admin' : '/technician';

// Logged-in users land on their dashboard; everyone else on /login.
// (Previously this always redirected to /login, which made it look like
// the saved session was lost whenever the tab was reopened.)
const RootRedirect = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return <Navigate to={userInfo ? dashboardPath(userInfo) : '/login'} replace />;
};

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // On app load, verify the saved JWT against the backend. If it is still
  // valid the profile is refreshed; if not, the session is cleared cleanly.
  useEffect(() => {
    if (userInfo) {
      dispatch(validateSession());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/asset/:assetCode" element={<PublicAssetPage />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

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
    </Routes>
  );
}

export default App;
