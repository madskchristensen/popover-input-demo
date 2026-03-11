import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
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

  async findAll(
    query: QueryJobApplicationDto,
  ): Promise<[JobApplication[], number]> {
    const sortColumn: string | undefined = query.sorting?.split(':')?.[0]
    const sortDirection: 'DESC' | 'ASC' =
      query.sorting?.split(':')?.[1] === 'ASC' ? 'ASC' : 'DESC'

    const { limit, skip } = query

    const qb = this.repo
      .createQueryBuilder('jobApplication')
      .skip(skip)
      .limit(limit)
      .leftJoinAndSelect('jobApplication.jobRole', 'jobRole')
      .leftJoinAndSelect('jobRole.jobCategory', 'jobCategory')

    // TODO: Implement sorting
    /*     switch (sortColumn) {
    } */

    const search = query.search
    const shouldSearch = search && search.length > 0

    if (shouldSearch) {
      qb.andWhere(
        new Brackets((qb) => {
          search.forEach(({ columns, table }) => {
            columns.forEach(({ payload, name }) => {
              const { exact, value } = payload

              const operator = exact ? '=' : 'ILIKE'

              const normalizedValue = value.trim()
              const searchValue = exact
                ? normalizedValue
                : `%${normalizedValue}%`

              const paramName = `search_value_${table}_${name}` // Makes sure the parameter name is unique

              // Cast the value from the searched column to text to avoid issues when dealing with ENUMS, numbers etc.
              qb.andWhere(
                `unaccent(CAST("${table}"."${name}" AS TEXT)) ${operator} unaccent(:${paramName})`,
                {
                  [paramName]: searchValue,
                },
              )
            })
          })
        }),
      )
    }

    return qb.orderBy('jobApplication.createdAt', 'DESC').getManyAndCount()
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
