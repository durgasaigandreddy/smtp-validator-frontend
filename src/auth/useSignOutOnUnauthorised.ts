import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { isUnauthorised } from '../api'
import { useAuth } from './useAuth'

export const useSignOutOnUnauthorised = () => {
  const queryClient = useQueryClient()
  const { signOut } = useAuth()

  useEffect(() => {
    const signOutIfRejected = (error: unknown) => {
      if (isUnauthorised(error)) signOut()
    }

    const unsubscribeQueries = queryClient
      .getQueryCache()
      .subscribe((event) => signOutIfRejected(event.query.state.error))

    const unsubscribeMutations = queryClient
      .getMutationCache()
      .subscribe((event) => signOutIfRejected(event.mutation?.state.error))

    return () => {
      unsubscribeQueries()
      unsubscribeMutations()
    }
  }, [queryClient, signOut])
}
