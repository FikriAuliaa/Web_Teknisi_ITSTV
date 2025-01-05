import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

export const createToken = (user: { id: string; username: string; role: string }) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '30m' }); // Token berlaku selama 30 menit
};
