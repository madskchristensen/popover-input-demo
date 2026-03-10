import PhotoPlaceholderIcon from '@/public/placeholder-photo.svg' // TODO: add this to project

// TODO: REMOVE? Unused atm
type PhotoCellProps = {
  photoUrl?: string
}

const PhotoCell: React.FC<PhotoCellProps> = ({ photoUrl }) => {
  return (
    <div>
      {photoUrl ? (
        <div className='relative w-28 h-20'>
          <img
            src={photoUrl}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
            alt='Car Photo'
          />
        </div>
      ) : (
        <PhotoPlaceholderIcon />
      )}
    </div>
  )
}

export default PhotoCell
