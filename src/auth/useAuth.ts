import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider.')
  return context
}

export const useApiKey = () => {
  const { session } = useAuth()
  if (!session) throw new Error('useApiKey must be used on a signed-in screen.')
  return session.key
}
