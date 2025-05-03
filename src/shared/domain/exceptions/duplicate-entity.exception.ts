import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateEntityException extends HttpException {
  constructor(entity: string, field: string, value: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: `${entity} with this ${field} already exists`,
        details: {
          entity,
          field,
          value,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
} 