// Potential rabbit hole to type this. Leaving as-is.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customQueryOptions = (args: any) => {
  const { queryKey } = args
  const [path, ...rest] = queryKey
  const customQueryKey = path.split('/').filter((key: string) => key !== '')

  return { ...args, queryKey: [...customQueryKey, ...rest] }
}

export default customQueryOptions
