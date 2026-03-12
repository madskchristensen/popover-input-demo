import { deUnderScoreString } from '@/components/JobApplicationTable/utils'
import { SearchInputDto, SelectOption } from '../types'
import {
  JobApplicationStatus,
  JobCategory,
  JobRole,
} from '@/orval/generated/models'

// TODO: Consider combining firstName + lastName
export const searchStateJobApplication: SearchInputDto[] = [
  {
    table: 'jobApplication',
    inputs: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'dropdown',
        transformer: (): SelectOption[] =>
          Object.values(JobApplicationStatus).map((status) => ({
            label: deUnderScoreString(status),
            value: status,
          })),
      },
    ],
  },
  {
    table: 'jobCategory',
    inputs: [
      {
        name: 'name',
        label: 'Category',
        type: 'dropdown',
        transformer: (source: JobCategory[]): SelectOption[] =>
          source.map((category) => ({
            label: category.name,
            value: category.name,
          })),
      },
    ],
  },
  {
    table: 'jobRole',
    inputs: [
      {
        name: 'title',
        label: 'Role',
        type: 'dropdown',
        transformer: (source: JobRole[]): SelectOption[] =>
          source.map((role) => ({
            label: role.title,
            value: role.title,
          })),
        isDependantOn: {
          table: 'jobCategory',
          column: 'name',
        },
      },
    ],
  },
]
