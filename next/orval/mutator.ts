import Axios, { AxiosError, AxiosRequestConfig } from 'axios'

export const axiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Custom axios mutator for Orval.
 * Referenced in orval.config.ts — all generated hooks route through this.
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source()

  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data as T)

  // Orval expects a cancel method on the returned promise for query cancellation
  ;(promise as Promise<T> & { cancel: () => void }).cancel = () => {
    source.cancel('Query was cancelled by Orval')
  }

  return promise
}

export type ErrorType<E> = AxiosError<E>
