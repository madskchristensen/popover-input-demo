import { JobApplication } from '@/orval/generated/models'
import { Button, Flex, HStack, Text } from '@chakra-ui/react'
import { FC, useMemo } from 'react'

type TableActionBarProps = {
  selected: JobApplication[]
}

const TableActionBar: FC<TableActionBarProps> = ({ selected }) => {
  const selectedIds = useMemo(() => selected.map(({ id }) => id), [selected])
  return (
    <Flex
      borderColor={'gray.200'}
      borderBottomWidth={'1px'}
      px={4}
      pb={6}
      alignItems={'center'}
    >
      <HStack justifyItems={'center'}>
        <Text display={'inline'} color={'black'} fontWeight={'bold'}>
          {selected.length} selected
        </Text>
      </HStack>
      <HStack ml={'auto'}>
        <Button
          variant={'outline'}
          disabled={!selectedIds.length}
          onClick={() => console.log('did something!')}
        >
          Do something
        </Button>
        <Button
          variant={'outline'}
          bg={'white'}
          maxW={'max-content'}
          disabled={!selectedIds.length}
          onClick={() => console.log('did something else!')}
        >
          Do something else
        </Button>
      </HStack>
    </Flex>
  )
}

export default TableActionBar
