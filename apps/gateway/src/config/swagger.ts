import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';

export const setupSwagger = (app: INestApplication, serverUrl: string): OpenAPIObject => {
    const config = new DocumentBuilder()
        .setTitle('Off Library API')
        .setDescription(
            'An API that is part of a Backend for Frontend (BFF) designed for web applications, tailoring responses and simplifying communication between the frontend and microservices..',
        )
        .setVersion('1.0.0')
        .setExternalDoc('Off Library API Documentation', '/swagger-spec.json')
        .addBearerAuth()
        .addServer(serverUrl)
        .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('../swagger-spec.json', JSON.stringify(document));
    return document;
};