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
      .createQueryBuilder('JobApplication')
      .skip(skip)
      .limit(limit)
      .leftJoinAndSelect('JobApplication.jobRole', 'jobRole')
      .leftJoinAndSelect('jobRole.jobCategory', 'jobCategory')

    // TODO: Implement sorting
    /*     switch (sortColumn) {
    } */

    const search = query.search
    const shouldSearch = search && search.length > 0

    if (shouldSearch) {
      // Manually join the tables that COULD be searched in.
      // This could be done programatically, if the search feature is expanded in the future, and to optimize the query a bit by avoiding unnecessary joins.
      qb.leftJoinAndSelect('contractInfo.address', 'address')

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
                `unaccent(CAST(${table}.${name} AS TEXT)) ${operator} unaccent(:${paramName})`,
                {
                  [paramName]: searchValue,
                },
              )
            })
          })
        }),
      )
    }

    /*     if (query.status) {
      qb.andWhere('JobApplication.status = :status', { status: query.status })
    }

    if (query.jobRoleId) {
      qb.andWhere('JobApplication.jobRoleId = :jobRoleId', {
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
      qb.andWhere('JobApplication.country = :country', {
        country: query.country,
      })
    } */

    /*     if (query.search) {
      // TODO: error  'query.search' will use Object's default stringification format ('[object Object]') when stringified  @typescript-eslint/no-base-to-string (line 54)
      // TODO: Invalid type "SearchDto[]" of template literal expression (line 53)
      qb.andWhere(
        '(JobApplication.firstName ILIKE :search OR JobApplication.lastName ILIKE :search OR JobApplication.email ILIKE :search)',
        { search: `%${query.search}%` },
      )
    } */

    return qb.orderBy('JobApplication.createdAt', 'DESC').getManyAndCount()
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
