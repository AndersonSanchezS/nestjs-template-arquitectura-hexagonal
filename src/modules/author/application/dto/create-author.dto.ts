import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDate, Length } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  biography?: string;
} 