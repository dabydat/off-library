import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsPositive } from 'class-validator';
import { BookLanguageEnum } from './enums/book-language.enum';
import { BookGenreEnum } from './enums/book-genre.enum';
import { Transform, Type } from 'class-transformer';

export class CreateBookRequest {
    @ApiProperty({ example: 'The Great Gatsby', description: 'Title of the book' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'Author of the book' })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({ example: '9780743273565', description: 'ISBN number of the book' })
    @IsString()
    @IsNotEmpty()
    isbn: string;

    @ApiProperty({ example: 'Scribner', description: 'Publisher of the book' })
    @IsString()
    @IsNotEmpty()
    publisher: string;

    @ApiProperty({ example: '1925-04-10', description: 'Publication date in YYYY-MM-DD format' })
    @IsDateString(
        { strict: true },
        { message: 'publication_date must be a valid ISO 8601 date string (YYYY-MM-DD)' }
    )
    publication_date: string;

    @ApiProperty({ example: 'FICTION', enum: BookGenreEnum, description: 'Genre of the book' })
    @IsEnum(BookGenreEnum)
    genre: BookGenreEnum;

    @ApiProperty({ example: 180, description: 'Number of pages in the book' })
    @Transform(({ value }) => parseInt(value, 10))
    @Type(() => Number)
    @IsNumber({}, { message: 'pages must be a number' })
    @IsPositive()
    pages: number;

    @ApiProperty({ example: 'ENGLISH', enum: BookLanguageEnum, description: 'Language of the book' })
    @IsEnum(BookLanguageEnum)
    language: BookLanguageEnum;

    @ApiProperty({ example: 'A novel set in the Roaring Twenties...', description: 'Summary or description of the book' })
    @IsString()
    summary: string;


    @ApiProperty({ example: 2, description: 'Quantity of copies available' })
    @IsNumber({}, { message: 'available_copies must be a number' })
    @IsPositive()
    available_copies: number;

    @ApiProperty({ example: 5, description: 'Price of the book' })
    @IsNumber({}, { message: 'price must be a number' })
    @IsPositive()
    price: number;
}