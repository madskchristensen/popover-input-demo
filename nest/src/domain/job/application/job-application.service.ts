import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { JobApplication } from './entities/job-application.entity'
import {
  CreateJobApplicationDto,
  QueryJobApplicationDto,
  UpdateJobApplicationDto,
} from './dtos/job-application.dto'
import { JobRoleService } from '../role/job-role.service'

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly repo: Repository<JobApplication>,
    private readonly jobRoleService: JobRoleService,
  ) {}

  async findAll(query: QueryJobApplicationDto): Promise<JobApplication[]> {
    const qb = this.repo
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.jobRole', 'jobRole')
      .leftJoinAndSelect('jobRole.jobCategory', 'jobCategory')

    if (query.status) {
      qb.andWhere('application.status = :status', { status: query.status })
    }

    if (query.jobRoleId) {
      qb.andWhere('application.jobRoleId = :jobRoleId', {
        jobRoleId: query.jobRoleId,
      })
    }

    // isDependentOn -> filter by category via the role relation
    if (query.jobCategoryId) {
      qb.andWhere('jobRole.jobCategoryId = :jobCategoryId', {
        jobCategoryId: query.jobCategoryId,
      })
    }

    if (query.country) {
      qb.andWhere('application.country = :country', { country: query.country })
    }

    if (query.search) {
      qb.andWhere(
        '(application.firstName ILIKE :search OR application.lastName ILIKE :search OR application.email ILIKE :search)',
        { search: `%${query.search}%` },
      )
    }

    return qb.orderBy('application.createdAt', 'DESC').getMany()
  }

  async findOne(id: string): Promise<JobApplication> {
    const application = await this.repo.findOne({
      where: { id },
      relations: ['jobRole', 'jobRole.jobCategory'],
    })
    if (!application)
      throw new NotFoundException(`JobApplication ${id} not found`)
    return application
  }

  async create(dto: CreateJobApplicationDto): Promise<JobApplication> {
    // Validate the role exists — implicitly validates the category chain too
    await this.jobRoleService.findOne(dto.jobRoleId)

    const application = this.repo.create(dto)
    return this.repo.save(application)
  }

  async update(
    id: string,
    dto: UpdateJobApplicationDto,
  ): Promise<JobApplication> {
    const application = await this.findOne(id)

    if (dto.jobRoleId && dto.jobRoleId !== application.jobRoleId) {
      await this.jobRoleService.findOne(dto.jobRoleId)
    }

    Object.assign(application, dto)
    return this.repo.save(application)
  }

  async remove(id: string): Promise<void> {
    const application = await this.findOne(id)
    await this.repo.remove(application)
  }
}
