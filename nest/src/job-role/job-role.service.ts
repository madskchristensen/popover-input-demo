import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { JobRole } from './entities/job-role.entity'
import {
  CreateJobRoleDto,
  QueryJobRoleDto,
  UpdateJobRoleDto,
} from './dtos/job-role.dto'

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

  async findOne(id: string): Promise<JobRole> {
    const role = await this.repo.findOne({
      where: { id },
      relations: ['jobCategory'],
    })
    if (!role) throw new NotFoundException(`JobRole ${id} not found`)
    return role
  }

  create(dto: CreateJobRoleDto): Promise<JobRole> {
    const role = this.repo.create(dto)
    return this.repo.save(role)
  }

  async update(id: string, dto: UpdateJobRoleDto): Promise<JobRole> {
    const role = await this.findOne(id)
    Object.assign(role, dto)
    return this.repo.save(role)
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id)
    await this.repo.remove(role)
  }
}
