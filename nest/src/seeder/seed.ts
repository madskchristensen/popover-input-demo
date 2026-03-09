import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { SeederModule } from './seeder.module'
import { SeederService } from './seeder.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  })

  const seeder = app.select(SeederModule).get(SeederService)

  try {
    await seeder.seed()
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err)
    process.exit(1)
  } finally {
    await app.close()
  }
}

void bootstrap()
