import { User } from "../domain/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(email: string, passwordHash: string): Promise<User>;
}
