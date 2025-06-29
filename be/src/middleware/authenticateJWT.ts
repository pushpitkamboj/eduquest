import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

// Middleware to authenticate JWT token
export const authenticateToken = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-jwt-secret') as any;
    
    // Check if session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      return res.status(403).json({ error: 'Session not found - please login again' });
    }

    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.session.delete({ where: { id: session.id } });
      return res.status(403).json({ error: 'Session expired - please login again' });
    }

    // Check if user still exists and is active
    if (!session.user || !session.user.isActive) {
      return res.status(403).json({ error: 'User account not found or inactive' });
    }

    req.user = decoded;
    next();
    return;
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}