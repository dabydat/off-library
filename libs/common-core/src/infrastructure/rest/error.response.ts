import { ApiProperty } from '@nestjs/swagger';

class ErrorDetail {
    @ApiProperty({ example: 'Invalid value for parameter' })
    message: string;

    @ApiProperty({ example: 'INVALID_PARAMETER' })
    code: string;

    @ApiProperty({ example: 'parameter_name' })
    param: string;
}

export class ErrorResponse {
    @ApiProperty({ example: 'The request could not be processed due to validation errors.' })
    message: string;

    @ApiProperty({ example: 'VALIDATION_ERROR' })
    code: string;

    @ApiProperty({ type: [ErrorDetail], description: 'List of specific error details related to the request' })
    details: ErrorDetail[];
}
