import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export class AuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  async register(email: string, password: string): Promise<string> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw ApiError.badRequest('Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userRepo.save(email, passwordHash);

    return this.signToken({ userId: user.id, email: user.email });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw ApiError.unauthorized('Invalid email or password');

    return this.signToken({ userId: user.id, email: user.email });
  }

  private signToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
  }
}