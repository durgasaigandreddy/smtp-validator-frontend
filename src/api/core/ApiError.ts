export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const isUnauthorised = (error: unknown) =>
  error instanceof ApiError && error.status === 401

export const isForbidden = (error: unknown) => error instanceof ApiError && error.status === 403

export const isNotFound = (error: unknown) => error instanceof ApiError && error.status === 404
