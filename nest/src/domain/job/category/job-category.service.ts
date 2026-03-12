import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { JobCategory } from './entities/job-category.entity'
import { QueryJobCategoryDto } from './dtos/query.dto'

@Injectable()
export class JobCategoryService {
  constructor(
    @InjectRepository(JobCategory)
    private readonly repo: Repository<JobCategory>,
  ) {}

  findAll(query: QueryJobCategoryDto): Promise<JobCategory[]> {
    return this.repo.find({
      where: query.search ? { name: ILike(`%${query.search}%`) } : {},
      order: { name: 'ASC' },
    })
  }
}
