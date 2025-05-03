import { Injectable, Inject } from '@nestjs/common';
import { IAuthorRepository, AUTHOR_REPOSITORY } from '../../domain/repositories/author.repository';
import { Author } from '../../domain/entities/author.entity';

@Injectable()
export class FindAllAuthorsUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: IAuthorRepository,
  ) {}

  async execute(): Promise<Author[]> {
    return this.authorRepository.findAll();
  }
} 