import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Token not found",
      data: {},
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({
        status: "error",
        message: "Failed to authenticate token",
        data: {},
      });
      return;
    }

    const { id, username, role } = decoded as { id: string; username: string; role: string };

    req.body.user = {
      id,
      username,
      role,
    };

    next();
  });
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.body.user?.role;

    if (!roles.includes(userRole)) {
      res.status(403).json({
        status: "error",
        message: "You do not have permission to access this resource",
        data: {},
      });
      return;
    }

    next();
  };
};
