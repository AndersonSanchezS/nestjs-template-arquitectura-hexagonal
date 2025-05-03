import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthorRepository } from '../../domain/repositories/author.repository';
import { Author } from '../../domain/entities/author.entity';

@Injectable()
export class AuthorRepository implements IAuthorRepository {
  constructor(
    @InjectRepository(Author)
    private readonly typeOrmRepository: Repository<Author>,
  ) {}

  async findAll(): Promise<Author[]> {
    return this.typeOrmRepository.find();
  }

  async findById(id: string): Promise<Author | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Author | null> {
    return this.typeOrmRepository.findOne({ where: { email } });
  }

  async create(authorData: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>): Promise<Author> {
    const author = this.typeOrmRepository.create(authorData);
    return this.typeOrmRepository.save(author);
  }

  async update(id: string, authorData: Partial<Author>): Promise<Author> {
    await this.typeOrmRepository.update(id, authorData);
    const updatedAuthor = await this.findById(id);
    if (!updatedAuthor) {
      throw new Error('Author not found');
    }
    return updatedAuthor;
  }

  async delete(id: string): Promise<void> {
    await this.typeOrmRepository.delete(id);
  }
} 