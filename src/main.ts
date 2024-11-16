import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger.config';

const PORT=process.env.PORT

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions)
 
  await app.listen(PORT,()=>{
    console.log(
      `run on port${PORT} adress:http://localhost:${PORT}  swagger:http://localhost:${PORT}/api , para auteticar con google:  http://localhost:${PORT}/auth/google
`,
      )
  });
}
bootstrap();
