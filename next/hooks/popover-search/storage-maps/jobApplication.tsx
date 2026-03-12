import { deUnderScoreString } from '@/components/JobApplicationTable/utils'
import { SearchInputDto, SelectOption } from '../types'
import {
  JobApplicationStatus,
  JobCategory,
  JobRole,
} from '@/orval/generated/models'

// TODO: Consider combining firstName + lastName
// ! The dropdowns are dependant on the source map: OPTIONS_SOURCE_MAP_KEYS (/utils/index.ts)
export const searchStateJobApplication: SearchInputDto[] = [
  {
    table: 'jobApplication',
    inputs: [
      {
        column: 'firstName',
        label: 'First Name',
        type: 'text',
      },
      {
        column: 'lastName',
        label: 'Last Name',
        type: 'text',
      },
      {
        column: 'email',
        label: 'Email',
        type: 'text',
      },
      {
        column: 'status',
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
        column: 'code',
        label: 'Category',
        type: 'dropdown',
        transformer: (source: JobCategory[]): SelectOption[] =>
          source.map((category) => ({
            label: category.name,
            value: category.code,
          })),
      },
    ],
  },
  {
    table: 'jobRole',
    inputs: [
      {
        column: 'title',
        label: 'Role',
        type: 'dropdown',
        transformer: (source: JobRole[]): SelectOption[] =>
          source.map((role) => ({
            label: role.title,
            value: role.title,
          })),
        isDependantOn: {
          table: 'jobCategory',
          column: 'code',
        },
      },
    ],
  },
]
