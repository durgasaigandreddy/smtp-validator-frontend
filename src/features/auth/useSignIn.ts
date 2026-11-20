import { useState } from 'react'
import { useVerifyApiKey } from '../../api'
import { useAuth } from '../../auth'
import type { SignInMode } from './components/ModeTabs'

const wrongTabMessage: Record<SignInMode, string> = {
  admin: 'That is not an admin key. Use the User tab instead.',
  user: 'That is an admin key. Use the Admin tab instead.',
}

export const useSignIn = (mode: SignInMode) => {
  const { signIn } = useAuth()
  const [error, setError] = useState('')
  const verifyKey = useVerifyApiKey()

  const submit = (rawKey: string) => {
    const key = rawKey.trim()
    setError('')

    if (!key) {
      setError('Enter your API key.')
      return
    }

    verifyKey.mutate(key, {
      onSuccess: (identity) => {
        if (identity.is_admin !== (mode === 'admin')) {
          setError(wrongTabMessage[mode])
          return
        }
        signIn({ key, identity })
      },
      onError: (cause: Error) => setError(cause.message),
    })
  }

  return { submit, error, clearError: () => setError(''), isPending: verifyKey.isPending }
}
