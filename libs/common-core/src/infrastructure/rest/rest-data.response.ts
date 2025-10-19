import { ApiProperty } from '@nestjs/swagger';

export class RestDataResponse<T> {
    @ApiProperty({
        description: 'Payload of the response with the requested data\n',
    })
    public data: T;
}
