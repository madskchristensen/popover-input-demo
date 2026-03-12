import { useMemo } from 'react'
import { DateTime } from 'luxon'
import { JobApplication } from '@/orval/generated/models'
import { JobApplicationTableItem } from '../types/TableItem'

export const useSerializeJobApplicationTableData = (
  jobApplications: JobApplication[],
): JobApplicationTableItem[] => {
  const formatDate = (isoDate: string) =>
    DateTime.fromISO(isoDate).toFormat('dd//MM/yy')

  return useMemo(() => {
    return jobApplications.map((application) => {
      const {
        country,
        createdAt,
        email,
        firstName,
        id,
        jobRole,
        jobRoleId,
        lastName,
        status,
        updatedAt,
      } = application

      return {
        id,
        firstName,
        lastName,
        email,
        status,
        country,
        createdAt: formatDate(createdAt),
        jobRole: jobRole.title,
        jobCategory: jobRole.jobCategory.name,
      } satisfies JobApplicationTableItem
    })
  }, [jobApplications])
}
