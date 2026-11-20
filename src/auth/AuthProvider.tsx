import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext, type Session } from './AuthContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const queryClient = useQueryClient()

  const signOut = useCallback(() => {
    setSession(null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo(() => ({ session, signIn: setSession, signOut }), [session, signOut])

  return <AuthContext value={value}>{children}</AuthContext>
}
