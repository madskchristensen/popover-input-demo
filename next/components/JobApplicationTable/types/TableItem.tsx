import { JobApplicationStatus } from '@/orval/generated/models'

export type JobApplicationTableItem = {
  id: string
  firstName: string
  lastName: string
  email: string
  status: JobApplicationStatus
  country: string // ISO Code
  createdAt: string
  jobRole: string // TODO: Datatype: enum?
  jobCategory: string // TODO: Datatype: enum?
}
