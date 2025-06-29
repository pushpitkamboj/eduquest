import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
// import userRoutes from './users';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

// API info endpoint
router.get('/', (_req, res) => {
  res.json({
    message: 'EduQuest API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
    },
  });
});

export default router;
