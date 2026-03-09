import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { JobCategory } from './entities/job-category.entity'
import { QueryJobCategoryDto } from './dtos/query'
import { CreateJobCategoryDto } from './dtos/create'

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

  async findOne(id: string): Promise<JobCategory> {
    const category = await this.repo.findOne({
      where: { id },
      relations: ['roles'],
    })
    if (!category) throw new NotFoundException(`JobCategory ${id} not found`)
    return category
  }

  create(dto: CreateJobCategoryDto): Promise<JobCategory> {
    const category = this.repo.create(dto)
    return this.repo.save(category)
  }

  async update(id: string, dto: CreateJobCategoryDto): Promise<JobCategory> {
    const category = await this.findOne(id)
    Object.assign(category, dto)
    return this.repo.save(category)
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id)
    await this.repo.remove(category)
  }
}
