import { Controller, Get, Post, Put, Delete, Body, Param, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
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
  async create(@Body() authorData: CreateAuthorDto) {
    const author = await this.createAuthorUseCase.execute(authorData);
    return {
      error: false,
      message: 'Author created successfully',
      data: author,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() authorData: UpdateAuthorDto,
  ) {
    const author = await this.updateAuthorUseCase.execute(id, authorData);
    return {
      error: false,
      message: 'Author updated successfully',
      data: author,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteAuthorUseCase.execute(id);
    return {
      error: false,
      message: 'Author deleted successfully',
    };
  }

  @Get()
  async findAll() {
    const authors = await this.findAllAuthorsUseCase.execute();
    return {
      error: false,
      message: 'Authors retrieved successfully',
      data: authors,
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const author = await this.findAuthorByIdUseCase.execute(id);
    return {
      error: false,
      message: 'Author retrieved successfully',
      data: author,
    };
  }
} 