import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.services';
import { createToken } from '../services/token.services'; // Impor fungsi createToken

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const { username, email, password, role } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Registrasi pengguna
    const user = await authService.register(username, email, password, role);
    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during registration:", error.message);
      return res.status(400).json({ message: error.message });
    } else {
      console.error("Unknown error during registration:", error);
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Login pengguna
    const { user, token } = await authService.login(username, password);
    // Buat token JWT dengan masa berlaku 30 menit
    const tokenWithExpiry = createToken({
      id: String(user._id),
      username: user.username,
      role: user.role
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token: tokenWithExpiry,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during login:", error.message);
      return res.status(401).json({ message: error.message });
    } else {
      console.error("Unknown error during login:", error);
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
