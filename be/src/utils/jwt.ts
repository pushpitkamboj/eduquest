import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from '../types/user';
import dotenv from 'dotenv';
dotenv.config();
export const generateToken = (userId: string, email: string): string => {
  const payload: JWTPayload = {
    userId,
    email,
  };

  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  const options: SignOptions = {
    expiresIn: '7d',
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as JWTPayload;
};
