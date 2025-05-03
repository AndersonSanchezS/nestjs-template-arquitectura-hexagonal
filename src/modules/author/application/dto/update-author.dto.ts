import { IsString, IsOptional, IsEmail, IsDate, Length } from 'class-validator';

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  biography?: string;
} 