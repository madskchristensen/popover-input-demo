import { defineConfig } from 'orval'

export default defineConfig({
  jobApplications: {
    input: {
      target: '../../nest/swagger.json', // TODO: Proper solution
    },
    output: {
      mode: 'tags-split', // one file per swagger tag (job-applications, job-roles, job-categories)
      target: './generated',
      schemas: './generated/model',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
      override: {
        query: {
          version: 4,
          useQuery: true,
          useMutation: true,
        },
        mutator: {
          path: './mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
