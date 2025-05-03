import { Injectable, Inject } from '@nestjs/common';
import { IAuthorRepository, AUTHOR_REPOSITORY } from '../../domain/repositories/author.repository';
import { Author } from '../../domain/entities/author.entity';

@Injectable()
export class FindAuthorByIdUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: IAuthorRepository,
  ) {}

  async execute(id: string): Promise<Author> {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }
    return author;
  }
} 