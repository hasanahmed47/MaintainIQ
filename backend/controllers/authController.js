const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || null,
  token: generateToken(user._id),
});

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const normalizedEmail = String(email).toLowerCase();

    // Security: signing up as admin requires the secret admin access code
    // (set via ADMIN_SIGNUP_CODE in .env). Everyone else joins as a technician.
    if (role === 'admin') {
      if (!process.env.ADMIN_SIGNUP_CODE) {
        return res.status(403).json({
          message: 'Admin registration is disabled on this server. Please sign up as a technician.',
        });
      }
      if (adminCode !== process.env.ADMIN_SIGNUP_CODE) {
        return res.status(403).json({ message: 'Invalid admin access code' });
      }
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: role === 'admin' ? 'admin' : 'technician',
    });

    res.status(201).json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: String(email || '').toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      if (user && !user.password && user.googleId) {
        return res.status(401).json({
          message: 'This account uses Google Sign-In. Please continue with Google.',
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login / register with Google
// @route   POST /api/auth/google
// Verifies the Google ID token and finds-or-creates the user.
// Gracefully returns 501 when GOOGLE_CLIENT_ID is not configured,
// so the app never breaks in demos without Google set up.
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'No Google credential provided' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(501).json({ message: 'Google Sign-In is not configured on this server' });
    }

    // Verify the ID token with Google's official tokeninfo endpoint.
    // Google validates the signature and expiry; we additionally check
    // audience, issuer and email verification below.
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!verifyRes.ok) {
      return res.status(401).json({ message: 'Invalid Google credential' });
    }

    const payload = await verifyRes.json();

    const audienceOk = payload.aud === process.env.GOOGLE_CLIENT_ID;
    const issuerOk =
      payload.iss === 'accounts.google.com' || payload.iss === 'https://accounts.google.com';
    const emailVerified = payload.email_verified === 'true' || payload.email_verified === true;

    if (!audienceOk || !issuerOk) {
      return res.status(401).json({ message: 'Google credential failed verification' });
    }
    if (!emailVerified || !payload.email) {
      return res.status(401).json({ message: 'Google account email is not verified' });
    }

    const email = String(payload.email).toLowerCase();
    const googleId = payload.sub;

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // Link Google to an existing account (or refresh profile info)
      user.googleId = googleId;
      if (payload.picture) user.avatar = payload.picture;
      await user.save();
    } else {
      user = await User.create({
        name: payload.name || email.split('@')[0],
        email,
        googleId,
        avatar: payload.picture || null,
        role: 'technician',
      });
    }

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Get all technicians (for assignment dropdowns)
// @route   GET /api/auth/technicians
const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' }).select('-password');
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, googleAuth, getMe, getTechnicians };
