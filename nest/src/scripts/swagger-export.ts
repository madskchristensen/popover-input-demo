import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { AppModule } from 'src/app.module'

async function exportSwagger() {
  const app = await NestFactory.create(AppModule, { logger: false })

  const config = new DocumentBuilder()
    .setTitle('Job Applications API')
    .setDescription('API for managing job applications')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  const outputPath = resolve(process.cwd(), 'swagger.json')

  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8')
  console.log(`Swagger JSON written to ${outputPath}`)

  await app.close()
  process.exit(0)
}

exportSwagger()
