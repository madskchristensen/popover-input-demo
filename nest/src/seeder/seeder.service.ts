import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JobApplication } from 'src/domain/job/application/entities/job-application.entity'
import { JobCategory } from 'src/domain/job/category/entities/job-category.entity'
import { ApplicationStatus } from 'src/domain/job/enums/application-status'
import { JobRole } from 'src/domain/job/role/entities/job-role.entity'
import { Repository } from 'typeorm'

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
    await this.seedCategories()
    await this.seedRoles()
    await this.seedApplications()
    this.logger.log('Seeding complete.')
  }

  // ─── Categories ────────────────────────────────────────────────────────────

  private async seedCategories(): Promise<void> {
    const count = await this.categoryRepo.count()
    if (count > 0) {
      this.logger.log(`Skipping categories — ${count} already exist.`)
      return
    }

    const categories = this.categoryRepo.create([
      { name: 'Software', code: 'SOFTWARE' },
      { name: 'Design', code: 'DESIGN' },
      { name: 'Marketing', code: 'MARKETING' },
      { name: 'Operations', code: 'OPERATIONS' },
    ])

    await this.categoryRepo.save(categories)
    this.logger.log(`Seeded ${categories.length} categories.`)
  }

  // ─── Roles ─────────────────────────────────────────────────────────────────

  private async seedRoles(): Promise<void> {
    const count = await this.roleRepo.count()
    if (count > 0) {
      this.logger.log(`Skipping roles — ${count} already exist.`)
      return
    }

    const categories = await this.categoryRepo.find()
    const byCode = Object.fromEntries(categories.map((c) => [c.code, c]))

    const roles = this.roleRepo.create([
      // Software
      { title: 'Fullstack Engineer', jobCategoryId: byCode['SOFTWARE'].id },
      { title: 'Frontend Engineer', jobCategoryId: byCode['SOFTWARE'].id },
      { title: 'Backend Engineer', jobCategoryId: byCode['SOFTWARE'].id },
      { title: 'DevOps Engineer', jobCategoryId: byCode['SOFTWARE'].id },
      { title: 'QA Engineer', jobCategoryId: byCode['SOFTWARE'].id },
      // Design
      { title: 'UX Designer', jobCategoryId: byCode['DESIGN'].id },
      { title: 'UI Designer', jobCategoryId: byCode['DESIGN'].id },
      { title: 'Product Designer', jobCategoryId: byCode['DESIGN'].id },
      // Marketing
      { title: 'SEO Specialist', jobCategoryId: byCode['MARKETING'].id },
      { title: 'Content Strategist', jobCategoryId: byCode['MARKETING'].id },
      { title: 'Growth Marketer', jobCategoryId: byCode['MARKETING'].id },
      // Operations
      { title: 'Project Manager', jobCategoryId: byCode['OPERATIONS'].id },
      { title: 'Scrum Master', jobCategoryId: byCode['OPERATIONS'].id },
      { title: 'Business Analyst', jobCategoryId: byCode['OPERATIONS'].id },
    ])

    await this.roleRepo.save(roles)
    this.logger.log(`Seeded ${roles.length} roles.`)
  }

  // ─── Applications ──────────────────────────────────────────────────────────

  private async seedApplications(): Promise<void> {
    const count = await this.applicationRepo.count()
    if (count > 0) {
      this.logger.log(`Skipping applications — ${count} already exist.`)
      return
    }

    const roles = await this.roleRepo.find()
    const byTitle = Object.fromEntries(roles.map((r) => [r.title, r]))

    const applications = this.applicationRepo.create([
      {
        firstName: 'Alice',
        lastName: 'Jensen',
        email: 'alice.jensen@example.com',
        country: 'DK',
        status: ApplicationStatus.NEW,
        jobRoleId: byTitle['Fullstack Engineer'].id,
      },
      {
        firstName: 'Bob',
        lastName: 'Müller',
        email: 'bob.muller@example.com',
        country: 'DE',
        status: ApplicationStatus.IN_REVIEW,
        jobRoleId: byTitle['DevOps Engineer'].id,
      },
      {
        firstName: 'Clara',
        lastName: 'Dubois',
        email: 'clara.dubois@example.com',
        country: 'FR',
        status: ApplicationStatus.PENDING_REVIEW,
        jobRoleId: byTitle['UX Designer'].id,
      },
      {
        firstName: 'David',
        lastName: 'Smith',
        email: 'david.smith@example.com',
        country: 'GB',
        status: ApplicationStatus.SHORTLISTED,
        jobRoleId: byTitle['Backend Engineer'].id,
      },
      {
        firstName: 'Eva',
        lastName: 'Novak',
        email: 'eva.novak@example.com',
        country: 'PL',
        status: ApplicationStatus.REVIEWED,
        jobRoleId: byTitle['Content Strategist'].id,
      },
      {
        firstName: 'Fynn',
        lastName: 'Hansen',
        email: 'fynn.hansen@example.com',
        country: 'DK',
        status: ApplicationStatus.REJECTED,
        jobRoleId: byTitle['QA Engineer'].id,
      },
      {
        firstName: 'Grace',
        lastName: "O'Brien",
        email: 'grace.obrien@example.com',
        country: 'IE',
        status: ApplicationStatus.NEW,
        jobRoleId: byTitle['Product Designer'].id,
      },
      {
        firstName: 'Henrik',
        lastName: 'Larsson',
        email: 'henrik.larsson@example.com',
        country: 'SE',
        status: ApplicationStatus.IN_REVIEW,
        jobRoleId: byTitle['Scrum Master'].id,
      },
      {
        firstName: 'Isla',
        lastName: 'Fernández',
        email: 'isla.fernandez@example.com',
        country: 'ES',
        status: ApplicationStatus.PENDING_REVIEW,
        jobRoleId: byTitle['Frontend Engineer'].id,
      },
      {
        firstName: 'Jonas',
        lastName: 'De Vries',
        email: 'jonas.devries@example.com',
        country: 'NL',
        status: ApplicationStatus.SHORTLISTED,
        jobRoleId: byTitle['Business Analyst'].id,
      },
    ])

    await this.applicationRepo.save(applications)
    this.logger.log(`Seeded ${applications.length} applications.`)
  }
}
