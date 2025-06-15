import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/env";

interface TokenPayload extends JwtPayload {
  id: number;
  role: 'user' | 'restaurant';
}

export interface CustomRequest extends Request {
  user: TokenPayload
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (typeof decoded === 'string') {
      throw new Error('Invalid token format');
    };

    (req as CustomRequest).user = decoded as TokenPayload;
    next();
  } catch(error) {
    res.status(401).json({
      success: false,
      message: 'Please Authenticate'
    });
  };
};
