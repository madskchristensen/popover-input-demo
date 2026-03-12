import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { JobRole } from './entities/job-role.entity'
import { QueryJobRoleDto } from './dtos/query.dto'

@Injectable()
export class JobRoleService {
  constructor(
    @InjectRepository(JobRole)
    private readonly repo: Repository<JobRole>,
  ) {}

  findAll(query: QueryJobRoleDto): Promise<JobRole[]> {
    return this.repo.find({
      where: {
        ...(query.jobCategoryId ? { jobCategoryId: query.jobCategoryId } : {}),
        ...(query.search ? { title: ILike(`%${query.search}%`) } : {}),
      },
      relations: ['jobCategory'],
      order: { title: 'ASC' },
    })
  }
}
