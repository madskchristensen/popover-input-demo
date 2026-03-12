import { TableIdentifier } from '@/hooks/popover-search/core'
import { SearchUpdateStateParams } from '@/hooks/popover-search/use-search'
import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react'
import React, { JSX } from 'react'

type PopoverInputWrapperProps = TableIdentifier & {
  value: string
  name: string
  updateState: (params: SearchUpdateStateParams) => void
  isDisabled?: boolean
  label: string
  children: JSX.Element
  initialFocusRef: React.MutableRefObject<null>
  isOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
  isPopoverBlock?: boolean
}

const PopoverInputWrapper: React.FC<PopoverInputWrapperProps> = ({
  value,
  name,
  table,
  updateState,
  children,
  initialFocusRef,
  label,
  isDisabled,
  isOpen,
  onOpen,
  onClose,
  isPopoverBlock,
}) => {
  return (
    /* Lazy load and unmount on close to:
     * 1. Improve perfomance by not rendering the popover content on initial render
     * 2. Fix a bug where a PopoverDropdown's input element would block other elements, after closing the popover -
     * - due to some weird behavior where react-select would not set visibility to hidden on it's input element
     */
    <Popover
      initialFocusRef={initialFocusRef}
      isLazy={true}
      lazyBehavior='unmount'
      placement='bottom-start'
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Box maxW={'35%'}>
              <Flex align={'center'} justify={'start'}>
                <Button
                  variant={value ? 'solid' : 'outline'}
                  isDisabled={isDisabled}
                  height={'2.5em'}
                  fontSize={'small'}
                  paddingY={1}
                  paddingX={4}
                  display={'inline-flex'}
                >
                  {value ? (
                    <>
                      <span className='mr-1'>{label}:</span>
                      <span
                        dir='rtl'
                        className='overflow-hidden whitespace-nowrap text-left inline-block truncate'
                      >
                        {value}
                      </span>

                      {/* TODO: Close icon can be hard to hit. Maybe margin/padding hack or another solution to make the clickable box bigger? */}
                      <Box
                        as='span'
                        ml={2}
                        pb={0.185}
                        cursor={'pointer'}
                        display={'inline-flex'}
                        role='button'
                        aria-label={`Clear ${label}`}
                        onClick={(e: React.MouseEvent) => {
                          if (!isOpen) {
                            e.stopPropagation() // When resetting -> If popover is open, close it. If popover is closed, do nothing.
                          }

                          updateState({
                            action: 'RESET_SINGLE',
                            table,
                            name,
                          })
                        }}
                      >
                        <CloseIcon
                          width='8px'
                          height='8px'
                          color='red'
                          _hover={{ color: 'red.400' }}
                        />
                      </Box>
                    </>
                  ) : (
                    <span>{label}</span>
                  )}
                </Button>
              </Flex>
            </Box>
          </PopoverTrigger>
          <PopoverContent p={3} width={isPopoverBlock ? '100%' : undefined}>
            <PopoverArrow />
            <Stack
              direction='column'
              alignItems={'start'}
              spacing={2}
              fontSize={'x-small'}
            >
              {children}
            </Stack>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

export default PopoverInputWrapper
