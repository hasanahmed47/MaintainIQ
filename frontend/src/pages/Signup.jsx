import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser, googleLogin } from '../redux/authSlice';
import GoogleButton from '../components/auth/GoogleButton';
import './Login.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [formError, setFormError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  // Already signed in → go straight to the dashboard
  if (userInfo) {
    return <Navigate to={userInfo.role === 'admin' ? '/admin' : '/technician'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const result = await dispatch(
      registerUser({
        name,
        email,
        password,
        // Only request the admin role when an access code was entered;
        // the backend verifies it against ADMIN_SIGNUP_CODE either way.
        role: adminCode.trim() ? 'admin' : 'technician',
        adminCode: adminCode.trim() || undefined,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate(result.payload.role === 'admin' ? '/admin' : '/technician');
    }
  };

  const handleGoogleSuccess = useCallback(
    async (credential) => {
      const result = await dispatch(googleLogin(credential));
      if (googleLogin.fulfilled.match(result)) {
        navigate(result.payload.role === 'admin' ? '/admin' : '/technician');
      }
    },
    [dispatch, navigate]
  );

  const displayError = formError || error;

  return (
    <div className="login-wrapper">
      <motion.div
        className="login-brand-panel"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="brand-glow" />
        <span className="brand-kicker">MaintainIQ Platform</span>
        <h1 className="brand-title">Join the<br />Maintenance Team.</h1>
        <p className="brand-subtext">
          Create your workspace account in seconds, or continue with Google —
          your session stays signed in until you log out.
        </p>

        <div className="brand-stats">
          <div className="stat-block">
            <span className="stat-number">01</span>
            <span className="stat-label">Create account</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">02</span>
            <span className="stat-label">Get a dashboard</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">03</span>
            <span className="stat-label">Start maintaining</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="login-form-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Create account</h2>
          <p className="form-subtext">Start your MaintainIQ journey</p>

          {displayError && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {displayError}
            </motion.div>
          )}

          <div className="input-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ahmed Hasan"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@maintainiq.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="adminCode">Admin access code (optional)</label>
            <input
              id="adminCode"
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Leave empty to join as a technician"
            />
            <p className="form-hint">
              Technicians manage assigned issues. Admins need the access code set by the server.
            </p>
          </div>

          <motion.button
            type="submit"
            className="login-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>

          <div className="auth-divider">or</div>

          <GoogleButton onSuccess={handleGoogleSuccess} text="signup_with" />

          <p className="switch-auth">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
