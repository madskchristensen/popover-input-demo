import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { faker } from '@faker-js/faker'
import { JobApplication } from 'src/domain/job/application/entities/job-application.entity'
import { JobCategory } from 'src/domain/job/category/entities/job-category.entity'
import { JobRole } from 'src/domain/job/role/entities/job-role.entity'
import { Repository } from 'typeorm'
import { generateJobApplication } from './generators'

const CATEGORIES: Pick<JobCategory, 'name' | 'code'>[] = [
  { name: 'Software', code: 'SOFTWARE' },
  { name: 'Design', code: 'DESIGN' },
  { name: 'Marketing', code: 'MARKETING' },
  { name: 'Operations', code: 'OPERATIONS' },
]

const ROLES_BY_CATEGORY: Record<string, string[]> = {
  SOFTWARE: [
    'Fullstack Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'DevOps Engineer',
    'QA Engineer',
  ],
  DESIGN: ['UX Designer', 'UI Designer', 'Product Designer'],
  MARKETING: ['SEO Specialist', 'Content Strategist', 'Growth Marketer'],
  OPERATIONS: ['Project Manager', 'Scrum Master', 'Business Analyst'],
}

const APPLICATION_COUNT = 200

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name)

  constructor(
    @InjectRepository(JobCategory)
    private readonly categoryRepo: Repository<JobCategory>,
    @InjectRepository(JobRole)
    private readonly roleRepo: Repository<JobRole>,
    @InjectRepository(JobApplication)
    private readonly applicationRepo: Repository<JobApplication>,
  ) {}

  async seed(): Promise<void> {
    const categories = await this.seedCategories()
    const roles = await this.seedRoles(categories)
    await this.seedApplications(roles)
    this.logger.log('Seeding complete.')
  }

  private async seedCategories(): Promise<JobCategory[]> {
    const existing = await this.categoryRepo.find()
    if (existing.length > 0) {
      this.logger.log(`Skipping categories — ${existing.length} already exist.`)
      return existing
    }

    const categories = this.categoryRepo.create(CATEGORIES)
    const saved = await this.categoryRepo.save(categories)
    this.logger.log(`Seeded ${saved.length} categories.`)
    return saved
  }

  private async seedRoles(categories: JobCategory[]): Promise<JobRole[]> {
    const existing = await this.roleRepo.find()
    if (existing.length > 0) {
      this.logger.log(`Skipping roles — ${existing.length} already exist.`)
      return existing
    }

    const byCode = Object.fromEntries(categories.map((c) => [c.code, c]))

    const roles = this.roleRepo.create(
      categories.flatMap((category) =>
        (ROLES_BY_CATEGORY[category.code] ?? []).map((title) => ({
          title,
          jobCategoryId: byCode[category.code].id,
        })),
      ),
    )

    const saved = await this.roleRepo.save(roles)
    this.logger.log(`Seeded ${saved.length} roles.`)
    return saved
  }

  private async seedApplications(roles: JobRole[]): Promise<void> {
    const count = await this.applicationRepo.count()
    if (count > 0) {
      this.logger.log(`Skipping applications — ${count} already exist.`)
      return
    }

    const applications = Array.from({ length: APPLICATION_COUNT }, () => {
      const role = faker.helpers.arrayElement(roles)
      return this.applicationRepo.create(generateJobApplication(role.id))
    })

    await this.applicationRepo.save(applications)
    this.logger.log(`Seeded ${applications.length} applications.`)
  }
}
