import { Tooltip } from '@chakra-ui/react'
import RecurringSellerIcon from '@/public/recurring-seller.svg'
import ResubmitIconSvg from '@/public/resubmission-icon.svg'

type CarAndOwnerCellProps = {
  car: string
  owner: string
  isRecurringSeller: boolean
  resubmissionCount: number
}

const CarAndOwnerCell: React.FC<CarAndOwnerCellProps> = ({
  car,
  owner,
  isRecurringSeller,
  resubmissionCount,
}) => {
  const resubmittedTimesText = `time${resubmissionCount > 1 ? 's' : ''}`

  return (
    <div className='flex flex-col justify-center-center'>
      <p className='mb-1'>{car}</p>
      <div className='flex items-center'>
        {isRecurringSeller && (
          <span className='mr-[2px] justify-center pb-1'>
            <Tooltip content={`${owner} is a recurring seller`}>
              <RecurringSellerIcon />
            </Tooltip>
          </span>
        )}
        {resubmissionCount > 0 && (
          <span className='flex justify-center items-center bg-[#FDD835] rounded-full w-4 h-4 mr-[2px] mb-1'>
            <Tooltip
              hasArrow
              label={`Resubmitted ${resubmissionCount} ${resubmittedTimesText}`}
            >
              <ResubmitIconSvg />
            </Tooltip>
          </span>
        )}
        {owner}
      </div>
    </div>
  )
}

export default CarAndOwnerCell
