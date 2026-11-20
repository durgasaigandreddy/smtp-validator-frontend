import { useMutation } from '@tanstack/react-query'
import { isForbidden } from '../core/ApiError'
import { requestJson } from '../core/request'
import type { Identity } from '../types'

export const adminStatusPath = '/admin/status'

const identityFromAdminStatus = async (apiKey: string): Promise<Identity> => {
  try {
    await requestJson<unknown>(adminStatusPath, { apiKey })
    return { id: null, name: 'Admin', is_admin: true }
  } catch (error) {
    if (isForbidden(error)) return { id: null, name: 'Client', is_admin: false }
    throw error
  }
}

export const useVerifyApiKey = () => useMutation({ mutationFn: identityFromAdminStatus })
