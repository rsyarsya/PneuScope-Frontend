import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { generateToken } from '../utils/jwt';
import { hashPassword, validatePassword } from '../utils/password';
import mongoose from 'mongoose';

// Pastikan koneksi database diatur dengan benar
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI, { dbName: 'PneuScope' })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register request body:', req.body);
    const { email: rawEmail, password, name, role } = req.body;

    // Normalisasi email menjadi huruf kecil
    const email = rawEmail.toLowerCase();
    console.log('Normalized email:', email);

    // Periksa apakah email sudah ada
    const existingUser = await User.findOne({ email });
    console.log('Existing user:', existingUser ? 'Yes' : 'No');
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash kata sandi sebelum menyimpan
    const hashedPassword = await hashPassword(password);
    console.log('Hashed password:', hashedPassword);

    // Buat user baru
    const user = new User({ email, password: hashedPassword, name, role });
    await user.save();
    console.log('User saved:', await User.findOne({ email }));

    // Buat token JWT
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login request body:', req.body);
    const { email: rawEmail, password } = req.body;

    // Normalisasi email menjadi huruf kecil
    const email = rawEmail.toLowerCase();
    console.log('Normalized email:', email);

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    console.log('User found:', user ? user.email : 'No user');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validasi kata sandi
    const isMatch = await validatePassword(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Buat token JWT
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
