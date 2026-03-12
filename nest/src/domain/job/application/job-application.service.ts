import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { JobApplication } from './entities/job-application.entity'
import { QueryJobApplicationDto } from './dtos/job-application.dto'

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly repo: Repository<JobApplication>,
  ) {}

  async findPaginated(
    query: QueryJobApplicationDto,
  ): Promise<[JobApplication[], number]> {
    const sortColumn: string | undefined = query.sorting?.split(':')?.[0]
    const sortDirection: 'DESC' | 'ASC' =
      query.sorting?.split(':')?.[1] === 'ASC' ? 'ASC' : 'DESC'

    const { limit, skip } = query

    const qb = this.repo
      .createQueryBuilder('jobApplication')
      .skip(skip)
      .take(limit)
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
              // Use unaccent to remove diacritics (normalize search input)
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
}
