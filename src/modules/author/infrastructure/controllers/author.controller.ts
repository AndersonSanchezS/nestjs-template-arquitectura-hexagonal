import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CreateAuthorUseCase } from '../../application/use-cases/create-author.use-case';
import { UpdateAuthorUseCase } from '../../application/use-cases/update-author.use-case';
import { DeleteAuthorUseCase } from '../../application/use-cases/delete-author.use-case';
import { FindAllAuthorsUseCase } from '../../application/use-cases/find-all-authors.use-case';
import { FindAuthorByIdUseCase } from '../../application/use-cases/find-author-by-id.use-case';
import { CreateAuthorDto } from '../../application/dto/create-author.dto';
import { UpdateAuthorDto } from '../../application/dto/update-author.dto';
import { Author } from '../../domain/entities/author.entity';

@Controller('authors')
export class AuthorController {
  constructor(
    private readonly createAuthorUseCase: CreateAuthorUseCase,
    private readonly updateAuthorUseCase: UpdateAuthorUseCase,
    private readonly deleteAuthorUseCase: DeleteAuthorUseCase,
    private readonly findAllAuthorsUseCase: FindAllAuthorsUseCase,
    private readonly findAuthorByIdUseCase: FindAuthorByIdUseCase,
  ) {}

  @Post()
  async create(@Body() authorData: CreateAuthorDto): Promise<Author> {
    return this.createAuthorUseCase.execute(authorData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() authorData: UpdateAuthorDto,
  ): Promise<Author> {
    return this.updateAuthorUseCase.execute(id, authorData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteAuthorUseCase.execute(id);
  }

  @Get()
  async findAll(): Promise<Author[]> {
    return this.findAllAuthorsUseCase.execute();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Author> {
    return this.findAuthorByIdUseCase.execute(id);
  }
} 