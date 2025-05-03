import { Author } from '../entities/author.entity';

export const AUTHOR_REPOSITORY = 'AUTHOR_REPOSITORY';

export interface IAuthorRepository {
  findAll(): Promise<Author[]>;
  findById(id: string): Promise<Author | null>;
  findByEmail(email: string): Promise<Author | null>;
  create(author: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>): Promise<Author>;
  update(id: string, author: Partial<Author>): Promise<Author>;
  delete(id: string): Promise<void>;
} 