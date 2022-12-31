import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../models/user';
import { NextFunction, Request, Response } from 'express';

const SECRET = process.env.TOKEN_SECRET as Secret;

export function generateToken(user: User) {
  return jwt.sign({ user: user }, SECRET);
}

export function checkAuthHeader(req: Request, res: Response, next: NextFunction): void | boolean {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Access denied, invalid token' });
    return;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Access denied, invalid token' });
    return;
  }
}
