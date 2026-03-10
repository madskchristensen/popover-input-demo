import { defineConfig } from 'orval'

export default defineConfig({
  jobApplications: {
    input: {
      target: '../../nest/swagger.json', // TODO: Proper solution
    },
    output: {
      mode: 'tags-split', // one file per swagger tag (job-applications, job-roles, job-categories)
      target: './generated/api',
      schemas: './generated/models',
      client: 'react-query',
      clean: true,
      prettier: true,
      httpClient: 'axios',
      baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
      override: {
        query: {
          version: 4,
          useQuery: true,
          useMutation: true,
          // By default Orval generates string query keys instead of array.
          // The mutator below will basically split the string using "/"
          // So the query key will follow RTK best practices.
          queryOptions: {
            path: './queryMutator.ts',
            name: 'customQueryOptions',
            default: true, // Apply to all queries by default
          },
        },
        mutator: {
          path: './mutator.ts',
          name: 'customInstance',
        },
        operations: {
          // Due to a bug in Orval (https://github.com/anymaniax/orval/issues/393) infinite queries need to be configured per operation.
          // Ideally this would be configured globally in the override object.
          JobApplicationController_findAll: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: 'page',
              queryOptions: {
                path: './queryMutator.ts',
                name: 'customQueryOptions',
                default: true, // Apply to all queries by default
              },
            },
          },
        },
      },
    },
  },
})
