import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/authenticateJWT';
const router = Router();



// Get current user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        picture: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const { name, firstName, lastName, phone } = req.body;

    // Validate input
    if (!name && !firstName && !lastName && !phone) {
      return res.status(400).json({ error: 'At least one field is required to update' });
    }

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        picture: true,
        isActive: true,
        isVerified: true,
        updatedAt: true
      }
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update email
router.put('/profile/email', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json({ error: 'New email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user exists and get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For users with password (non-Google OAuth), verify password
    if (currentUser.password) {
      const isValidPassword = await bcrypt.compare(password, currentUser.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Check if new email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Update email
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        email: newEmail,
        isVerified: false // Email needs to be re-verified
      },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        updatedAt: true
      }
    });

    return res.json({
      success: true,
      message: 'Email updated successfully. Please verify your new email.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.put('/profile/password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has a password (not OAuth-only user)
    if (!currentUser.password) {
      return res.status(400).json({ error: 'Cannot change password for OAuth-only accounts' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete account
router.delete('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const { password, confirmText } = req.body;

    // Require confirmation text
    if (confirmText !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({ 
        error: 'Please type "DELETE MY ACCOUNT" to confirm account deletion' 
      });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For users with password (non-Google OAuth), verify password
    if (currentUser.password && password) {
      const isValidPassword = await bcrypt.compare(password, currentUser.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } else if (currentUser.password && !password) {
      return res.status(400).json({ error: 'Password is required for account deletion' });
    }

    // Delete user and related data (Prisma will handle cascading deletes)
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// // Get all users (Admin only - basic implementation)
// router.get('/', authenticateToken, async (req: Request, res: Response) => {
//   try {
//     const { page = '1', limit = '10', search } = req.query;
//     const pageNum = parseInt(page as string);
//     const limitNum = parseInt(limit as string);
//     const skip = (pageNum - 1) * limitNum;

//     // Build where clause for search
//     const where: any = {};
//     if (search) {
//       where.OR = [
//         { name: { contains: search as string, mode: 'insensitive' } },
//         { email: { contains: search as string, mode: 'insensitive' } }
//       ];
//     }

//     const [users, total] = await Promise.all([
//       prisma.user.findMany({
//         where,
//         select: {
//           id: true,
//           email: true,
//           name: true,
//           firstName: true,
//           lastName: true,
//           isActive: true,
//           isVerified: true,
//           createdAt: true,
//           lastLogin: true
//         },
//         skip,
//         take: limitNum,
//         orderBy: { createdAt: 'desc' }
//       }),
//       prisma.user.count({ where })
//     ]);

//     return res.json({
//       success: true,
//       users,
//       pagination: {
//         page: pageNum,
//         limit: limitNum,
//         total,
//         pages: Math.ceil(total / limitNum)
//       }
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Get user by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user as any).userId;

    // Users can only view their own profile, or this could be extended for admin access
    if (id !== currentUserId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        picture: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
