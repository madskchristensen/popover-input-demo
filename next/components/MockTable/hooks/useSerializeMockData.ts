import { SubmissionTableItem } from '@/generated-api/models'
import { useMemo } from 'react'
import { MockForTable } from '../MockTable'
import { DateTime } from 'luxon'

/* Table data contains all submissions or submissions filtered by searchWord if searching */
// TODO: Adjust namings, data etc.
export const useSerializeMockTableData = (
  mocks: SubmissionTableItem[],
): MockForTable[] => {
  const formatDate = (isoDate: string) =>
    DateTime.fromISO(isoDate).toFormat('dd//MM/yy')

  return useMemo(() => {
    return mocks.map((submission) => {
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
  }, [mocks])
}
