import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { RestPaginationResponse } from '../rest/rest-pagination.response';

export const ApiOkResponsePaginated = <TModel extends Type<unknown>>({
    type,
    description,
}: {
    type: TModel;
    description?: string;
}) =>
    applyDecorators(
        ApiExtraModels(RestPaginationResponse, type),
        ApiOkResponse({
            description,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(RestPaginationResponse) },
                    {
                        properties: {
                            elements: {
                                type: 'array',
                                items: { $ref: getSchemaPath(type) },
                            },
                        },
                    },
                ],
            },
        }),
    );
