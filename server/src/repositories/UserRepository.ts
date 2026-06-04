import { prisma } from '../config/database';
import { User } from '../domain/User';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(email: string, passwordHash: string): Promise<User> {
    const row = await prisma.user.create({ data: { email, passwordHash } });
    return this.toDomain(row);
  }

  private toDomain(row: { id: string; email: string; passwordHash: string; createdAt: Date }): User {
    return new User(row.id, row.email, row.passwordHash, row.createdAt);
  }
}