import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class BookIdRequest {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID of the book' })
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    id: string;
}