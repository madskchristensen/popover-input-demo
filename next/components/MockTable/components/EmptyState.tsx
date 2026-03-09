type EmptyStateProps = {
  isError: boolean
  errorMessage: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ isError, errorMessage }) => {
  return (
    <div className='text-center flex items-center justify-center'>
      {!isError && (
        <div className='p-6 font-bold text-xl text-center'>No data found</div>
      )}

      {isError && (
        <div className='p-6 text-red text-xl font-bold space-y-4'>
          <p className='text-xl'>An error happened while fetching data</p>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default EmptyState
