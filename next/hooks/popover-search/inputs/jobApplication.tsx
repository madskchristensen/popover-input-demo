import { SearchInputDto, SelectOption } from '.'
import {
  JobApplicationStatus,
  JobCategory,
  JobRole,
} from '@/orval/generated/models'

export const searchStateJobApplication: SearchInputDto[] = [
  {
    table: 'jobApplication',
    inputs: [
      {
        name: 'firstName',
        label: 'Name',
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
            label: status.replace(/_/g, ' '),
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
