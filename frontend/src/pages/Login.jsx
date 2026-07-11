import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../redux/authSlice';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.role;
      navigate(role === 'admin' ? '/admin' : '/technician');
    }
  };

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
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
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

          <p className="demo-creds">
            Demo — Admin: <code>admin@maintainiq.com / admin123</code><br />
            Technician: <code>tech@maintainiq.com / tech123</code>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
