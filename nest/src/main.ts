import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  // Nest uses Express by default. We type the Generic to fit this, and allow support for app.set to configure the query parser (further down).
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  // https://docs.nestjs.com/controllers#query-parameters
  // Configure the query parser, to allow for rich query objects, such as nested query parameters.
  // Without this, rich query objects will silently fail and cause undefined query params.
  // e.g. ?filter[where][name]=John&filter[where][age]=30
  app.set('query parser', 'extended')

  app.enableCors({
    origin: process.env.NEXT_URL ?? 'http://localhost:3000',
  })

  const config = new DocumentBuilder()
    .setTitle('Job Applications API')
    .setDescription('API for managing job applications')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3001)
}

void bootstrap()
