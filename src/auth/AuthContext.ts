import { createContext } from 'react'
import type { Identity } from '../api'

export interface Session {
  key: string
  identity: Identity
}

export interface AuthContextValue {
  session: Session | null
  signIn: (session: Session) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
