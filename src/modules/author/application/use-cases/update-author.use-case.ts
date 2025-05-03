import { Injectable, Inject } from '@nestjs/common';
import { IAuthorRepository, AUTHOR_REPOSITORY } from '../../domain/repositories/author.repository';
import { Author } from '../../domain/entities/author.entity';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@Injectable()
export class UpdateAuthorUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: IAuthorRepository,
  ) {}

  async execute(id: string, authorData: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }

    if (authorData.email && authorData.email !== author.email) {
      const existingAuthor = await this.authorRepository.findByEmail(authorData.email);
      if (existingAuthor) {
        throw new Error('Author with this email already exists');
      }
    }

    return this.authorRepository.update(id, authorData);
  }
} 