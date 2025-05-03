import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsDate, IsOptional, Length, IsEmail } from 'class-validator';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  biography?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 