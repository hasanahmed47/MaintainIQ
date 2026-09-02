import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../redux/authSlice';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import './Login.css';

const ROLE_HOME = {
  admin: '/admin',
  supervisor: '/supervisor',
  technician: '/technician',
};

const PANEL_TRANSITION = { duration: 0.35, ease: 'easeInOut' };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(ROLE_HOME[userInfo.role] || '/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      navigate(ROLE_HOME[result.payload.role] || '/technician');
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@maintainiq.com');
      setPassword('admin123');
    } else {
      setEmail('tech@maintainiq.com');
      setPassword('tech123');
    }
  };

  return (
    <div className="login-wrapper">
      <motion.div
        className="login-brand-panel"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={PANEL_TRANSITION}
      >
        <div className="brand-glow" />
        <span className="brand-kicker">MaintainIQ Platform</span>
        <h1 className="brand-title">Scan. Report.<br />Diagnose. Maintain.</h1>
        <p className="brand-subtext">
          Every asset gets a digital identity, an AI-assisted triage flow,
          and a permanent history nothing else can replace.
        </p>

        <div className="brand-stats">
          <div className="stat-block">
            <span className="stat-number">01</span>
            <span className="stat-label">Register asset</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">02</span>
            <span className="stat-label">AI triage report</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">03</span>
            <span className="stat-label">Resolved &amp; logged</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="login-form-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ ...PANEL_TRANSITION, delay: 0.06 }}
      >
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="form-subtext">Sign in to your workspace</p>

          {error && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
                value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@maintainiq.com"
              autoComplete="off"
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
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>

          <motion.button
            type="submit"
            className="login-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>

          <GoogleAuthButton />

          <div className="demo-creds">
            <span className="demo-creds-label">Quick fill for testing</span>
            <div className="demo-creds-row">
              <button type="button" className="demo-chip" onClick={() => fillDemo('admin')}>
                Admin demo
              </button>
              <button type="button" className="demo-chip" onClick={() => fillDemo('technician')}>
                Technician demo
              </button>
            </div>
          </div>

          <p className="login-switch">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;