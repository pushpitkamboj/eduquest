import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/authenticateJWT';

const router = Router();

// Helper function to create session
const createSession = async (userId: string, token: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    }
  });
};

// Function to clean up expired sessions
const cleanupExpiredSessions = async () => {
  try {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
};

// Debug endpoint to check environment variables
router.get('/debug', (_: Request, res: Response) => {
  res.json({
    port: process.env['PORT'],
    clientId: process.env['GOOGLE_CLIENT_ID'] ? 'Set' : 'Not Set',
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ? 'Set' : 'Not Set',
    clientSecretLength: process.env['GOOGLE_CLIENT_SECRET']?.length || 0,
    callbackURL: '/api/auth/google/callback',
    fullCallbackURL: `http://localhost:${process.env['PORT'] || 3000}/api/auth/google/callback`,
    frontendURL: process.env['FRONTEND_URL']
  });
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req: Request, res: Response) => {
    // Successful authentication
    const user = req.user as any;
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email, 
        name: user.name 
      },
      process.env['JWT_SECRET'] || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    // Store session in database
    await createSession(user.id, token);

    // Redirect to frontend with token
    const frontendURL = process.env['FRONTEND_URL'] || 'http://localhost:3000';
    res.redirect(`${frontendURL}?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture
    }))}`);
  }
);

// Get current user
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
      
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email, 
        name: user.name 
      },
      process.env['JWT_SECRET'] || 'your-jwt-secret',
      { expiresIn: '7d' }
    );    // Store session in database
    await createSession(user.id, token);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || '',
        isVerified: false, // Email verification required
      }
    });    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email, 
        name: user.name 
      },
      process.env['JWT_SECRET'] || 'your-jwt-secret',
      { expiresIn: '7d' }
    );

    // Store session in database
    await createSession(user.id, token);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    // Remove session from database
    await prisma.session.deleteMany({
      where: { token }
    });

    return res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Optional: Logout from all devices
router.post('/logout-all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;

    // Remove all sessions for this user
    await prisma.session.deleteMany({
      where: { userId }
    });

    return res.json({ 
      success: true,
      message: 'Logged out from all devices successfully' 
    });
  } catch (error) {
    console.error('Logout all error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Clean up expired sessions periodically
setInterval(cleanupExpiredSessions, 60 * 60 * 1000); // Clean up every hour




export default router;