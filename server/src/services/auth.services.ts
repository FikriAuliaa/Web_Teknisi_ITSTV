import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model'; // Pastikan model di-import

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

  // Fungsi registrasi pengguna
  async register(username: string, email: string, password: string, role: string) {
    // Cek apakah username atau email sudah terdaftar
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    return user;
  }

  // Fungsi login pengguna
  async login(username: string, password: string) {
    // Cari pengguna berdasarkan username
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      this.jwtSecret,
      { expiresIn: '1d' }
    );

    return { user, token };
  }
}
