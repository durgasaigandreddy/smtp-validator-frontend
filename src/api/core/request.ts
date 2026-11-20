import { DEV_PREVIEW, devPreviewResponse } from '../../devPreview'
import { ApiError } from './ApiError'

export interface RequestOptions {
  apiKey: string
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
}

const UNREACHABLE = 0

const unreachableMessage = 'Could not reach the API. Check that the backend is running.'

const defaultMessages: Record<number, string> = {
  401: 'That key was not recognised.',
  403: 'Admin access is needed for this.',
  404: 'Not found.',
  502: unreachableMessage,
  503: unreachableMessage,
  504: unreachableMessage,
}

const toApiError = async (response: Response) => {
  const fallback =
    defaultMessages[response.status] ?? `Request failed with status ${response.status}.`
  try {
    const body = (await response.json()) as { detail?: string }
    return new ApiError(response.status, body.detail ?? fallback)
  } catch {
    return new ApiError(response.status, fallback)
  }
}

const send = async (path: string, { apiKey, method = 'GET', body }: RequestOptions) => {
  const isFormData = body instanceof FormData

  if (DEV_PREVIEW) {
    const previewed = await devPreviewResponse(path, method, apiKey, body)
    if (!previewed.ok) throw await toApiError(previewed)
    return previewed
  }

  let response: Response
  try {
    response = await fetch(path, {
      method,
      headers: {
        'X-API-Key': apiKey,
        ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(UNREACHABLE, unreachableMessage)
  }

  if (!response.ok) throw await toApiError(response)
  return response
}

export const requestJson = async <T>(path: string, options: RequestOptions): Promise<T> =>
  (await send(path, options)).json() as Promise<T>

export const requestBlob = async (path: string, options: RequestOptions): Promise<Blob> =>
  (await send(path, options)).blob()

export const requestEmpty = async (path: string, options: RequestOptions): Promise<void> => {
  await send(path, options)
}
