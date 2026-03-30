import express from 'express';
import { login, signup, updateRole, getProfile } from '../controllers/auth';
import { isAuthenticated } from '../middlewares/isAuth';

const router = express.Router();

// Health check
// http://localhost:5000/api/auth
router.get('/', (req, res) => {
    res.send('Auth service is running');
});

// Login
// http://localhost:5000/api/auth/login
router.post('/login', login);

// Signup
// http://localhost:5000/api/auth/signup
router.post('/signup', signup);

// Update role
// http://localhost:5000/api/auth/update-role
router.put('/update-role', isAuthenticated, updateRole);

// Get profile
// http://localhost:5000/api/auth/profile
router.get('/profile', isAuthenticated, getProfile);

export default router;