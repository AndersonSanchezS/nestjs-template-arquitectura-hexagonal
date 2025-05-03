import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './infrastructure/controllers/author.controller';
import { AuthorRepository } from './infrastructure/persistence/author.repository';
import { Author } from './domain/entities/author.entity';
import { CreateAuthorUseCase } from './application/use-cases/create-author.use-case';
import { UpdateAuthorUseCase } from './application/use-cases/update-author.use-case';
import { DeleteAuthorUseCase } from './application/use-cases/delete-author.use-case';
import { FindAllAuthorsUseCase } from './application/use-cases/find-all-authors.use-case';
import { FindAuthorByIdUseCase } from './application/use-cases/find-author-by-id.use-case';
import { AUTHOR_REPOSITORY } from './domain/repositories/author.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [
    {
      provide: AUTHOR_REPOSITORY,
      useClass: AuthorRepository,
    },
    CreateAuthorUseCase,
    UpdateAuthorUseCase,
    DeleteAuthorUseCase,
    FindAllAuthorsUseCase,
    FindAuthorByIdUseCase,
  ],
  exports: [
    CreateAuthorUseCase,
    UpdateAuthorUseCase,
    DeleteAuthorUseCase,
    FindAllAuthorsUseCase,
    FindAuthorByIdUseCase,
  ],
})
export class AuthorModule {} 