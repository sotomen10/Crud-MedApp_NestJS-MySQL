import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Products API')
  .setDescription('The products API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'Products API Documentation',
};

