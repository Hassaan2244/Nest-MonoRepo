import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Connect to the authentication microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4002,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000); // This is the HTTP server port
  console.log(`Gateway service is running on: ${await app.getUrl()}`);
}
bootstrap(); 