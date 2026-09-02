import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../redux/authSlice';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/technician');
    }
  };

  return (
    <div className="signup-wrapper">
      <motion.div
  className="signup-brand-panel"
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -40 }}
  transition={{ duration: 0.35, ease: 'easeInOut' }}
>
        <div className="signup-brand-glow" />
        <span className="signup-brand-kicker">MaintainIQ Platform</span>
        <h1 className="signup-brand-title">Join the team.<br />Start tracking today.</h1>
        <p className="signup-brand-subtext">
          Create your workspace account to register assets, triage issues with AI,
          and keep a permanent maintenance history.
        </p>

        <div className="signup-brand-stats">
          <div className="signup-stat-block">
            <span className="signup-stat-number">01</span>
            <span className="signup-stat-label">Create account</span>
          </div>
          <div className="signup-stat-block">
            <span className="signup-stat-number">02</span>
            <span className="signup-stat-label">Join as Technician</span>
          </div>
          <div className="signup-stat-block">
            <span className="signup-stat-number">03</span>
            <span className="signup-stat-label">Start resolving issues</span>
          </div>
        </div>
      </motion.div>

      <motion.div
  className="signup-form-panel"
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 40 }}
  transition={{ duration: 0.35, ease: 'easeInOut', delay: 0.06 }}
>
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create your account</h2>
          <p className="signup-form-subtext">New accounts join as Technician — an admin can promote you later</p>

          {(localError || error) && (
            <motion.div
              className="signup-error-banner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {localError || error}
            </motion.div>
          )}

          <div className="signup-input-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Muhammad Hasan"
              required
            />
          </div>

          <div className="signup-input-group">
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

          <div className="signup-input-group">
            <label htmlFor="password">Password</label>
            <div className="signup-password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
              <span className="signup-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>

          <div className="signup-input-group">
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

          <motion.button
            type="submit"
            className="signup-btn"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>

          <GoogleAuthButton />

          <p className="signup-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;