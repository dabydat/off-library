import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class GetBooksRequest {
    @ApiProperty({
        description: 'limit number of books to retrieve',
        example: 10,
        required: true,
        format: 'number',
    })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @Type(() => Number)
    @IsNumber({}, { message: 'limit must be a number' })
    @IsPositive()
    public readonly limit: number

    @ApiProperty({
        description: 'page number of books to retrieve',
        example: 1,
        required: true,
        format: 'number',
    })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @Type(() => Number)
    @IsNumber({}, { message: 'page must be a number' })
    @IsPositive()
    public readonly page: number

}