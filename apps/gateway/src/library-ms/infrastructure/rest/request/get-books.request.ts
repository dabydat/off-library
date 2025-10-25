import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class GetBooksRequest {
    @ApiProperty({
        description: 'Limit number of books to retrieve',
        example: 10,
        required: true,
        format: 'number',
    })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @Type(() => Number)
    @IsNumber({}, { message: 'Limit must be a number' })
    @IsPositive()
    public readonly limit: number

    @ApiProperty({
        description: 'Page number of books to retrieve',
        example: 1,
        required: true,
        format: 'number',
    })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @Type(() => Number)
    @IsNumber({}, { message: 'Page must be a number' })
    @IsPositive()
    public readonly page: number

}