import { ApiProperty } from '@nestjs/swagger';

export class GetBookResponse {
    @ApiProperty({ example: '1f4dba73-352f-4491-9e51-16f5b772ef68', description: 'Unique identifier for the book' })
    id: string;

    @ApiProperty({ example: 'The Great Gatsby', description: 'Title of the book' })
    name: string;

    @ApiProperty({ example: 'F. Scott Fitzgerald', description: 'Author of the book' })
    author: string;

    @ApiProperty({ example: '9780743273565', description: 'ISBN number of the book' })
    isbn: string;

    @ApiProperty({ example: 'Scribner', description: 'Publisher of the book' })
    publisher: string;

    @ApiProperty({ example: '1925-04-10', description: 'Publication date in YYYY-MM-DD format' })
    publication_date: string;

    @ApiProperty({ example: 'FICTION', description: 'Genre of the book' })
    genre: string;

    @ApiProperty({ example: 180, description: 'Number of pages in the book' })
    pages: number;

    @ApiProperty({ example: 'ENGLISH', description: 'Language of the book' })
    language: string;

    @ApiProperty({ example: 'A novel set in the Roaring Twenties...', description: 'Summary or description of the book', required: false })
    summary?: string;

    @ApiProperty({ example: '2025-10-24T01:22:06.000Z', description: 'Creation timestamp', required: false })
    created_at?: string;

    @ApiProperty({ example: '2025-10-24T01:22:06.000Z', description: 'Last update timestamp', required: false })
    updated_at?: string;

    @ApiProperty({ example: 5, description: 'Number of stars the book has received' })
    stars: number;

    @ApiProperty({ example: 10, description: 'Number of available copies of the book' })
    available_copies: number;

    @ApiProperty({ example: 1599, description: 'Price of the book' })
    price: number;
}