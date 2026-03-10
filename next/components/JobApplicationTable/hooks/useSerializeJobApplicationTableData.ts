import { useMemo } from 'react'
import { JobApplicationTableItem } from '../JobApplicationTable'
import { DateTime } from 'luxon'
import { JobApplication } from '@/orval/generated/models'

// TODO: Adjust namings, data etc.
export const useSerializeJobApplicationTableData = (
  data: JobApplication[],
): JobApplicationTableItem[] => {
  const formatDate = (isoDate: string) =>
    DateTime.fromISO(isoDate).toFormat('dd//MM/yy')

  return useMemo(() => {
    return data.map((submission) => {
      const contractSignedByBothParties = Boolean(
        submission.contractSignedByAdminAt,
      )

      return {
        id: submission.id,
        car: `${submission.carBrand} ${submission.carModel} ${submission.carVersion}`,
        owner: submission.user?.fullName ?? 'User fullname missing!',
        status: 'stepper status was here', // TODO: keep? was: getStepperStatus('internal', submission)?.title
        submittedDate: formatDate(submission.dateSubmitted),
        carNumber: submission.carNumber ?? '-',
        country: submission.countryCode,
        documentsRequested: submission.documentsRequested ?? '',
        photosRequested: submission.photosRequested,
        isRecurringSeller: Boolean(submission.user?.isRecurringSeller),
        primaryPhotoUrl: submission.primaryPhotoUrl,
        resubmissionCount: submission.resubmissionCount,
        contractSignedByBothParties,
        isCarPaid: submission.car.paymentStatus === 'PAID',
      }
    })
  }, [data])
}
