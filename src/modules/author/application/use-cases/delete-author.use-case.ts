import { Injectable, Inject } from '@nestjs/common';
import { IAuthorRepository, AUTHOR_REPOSITORY } from '../../domain/repositories/author.repository';

@Injectable()
export class DeleteAuthorUseCase {
  constructor(
    @Inject(AUTHOR_REPOSITORY)
    private readonly authorRepository: IAuthorRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }
    await this.authorRepository.delete(id);
  }
} 