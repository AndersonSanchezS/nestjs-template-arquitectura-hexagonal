import { Injectable, Inject } from '@nestjs/common';
import { IAuthorRepository, AUTHOR_REPOSITORY } from '../../domain/repositories/author.repository';
import { Author } from '../../domain/entities/author.entity';
import { CreateAuthorDto } from '../dto/create-author.dto';

@Injectable()
export class CreateAuthorUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: IAuthorRepository,
  ) {}

  async execute(authorData: CreateAuthorDto): Promise<Author> {
    const existingAuthor = await this.authorRepository.findByEmail(authorData.email);
    if (existingAuthor) {
      throw new Error('Author with this email already exists');
    }
    return this.authorRepository.create(authorData);
  }
} 