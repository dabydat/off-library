import { ApiProperty } from '@nestjs/swagger';

export class RestPaginationResponse<T> {
    @ApiProperty({
        description: 'Array of items of generic type',
    })
    public elements: T;

    @ApiProperty({
        type: Number,
        example: 15,
        description: 'The total count of elements available',
    })
    public total_elements: number;

    @ApiProperty({
        type: Number,
        example: 1,
        description: 'The total count of pages available',
    })
    public total_pages: number;

    @ApiProperty({
        type: Number,
        example: 10,
        description: 'The number of elements per page',
    })
    public limit: number;

    @ApiProperty({
        type: Number,
        example: 1,
        description: 'The current page number',
    })
    public page: number;
}
