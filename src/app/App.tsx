import { AuroraBackdrop } from '../components/AuroraBackdrop'
import { useAuth, useSignOutOnUnauthorised } from '../auth'
import { PreviewBanner } from '../devPreview'
import { AdminPage } from '../features/admin/AdminPage'
import { SignInPage } from '../features/auth/SignInPage'
import { UserPage } from '../features/jobs/UserPage'

const CurrentScreen = () => {
  const { session } = useAuth()

  if (!session) return <SignInPage />
  return session.identity.is_admin ? <AdminPage /> : <UserPage />
}

export const App = () => {
  useSignOutOnUnauthorised()

  return (
    <>
      <AuroraBackdrop />
      <CurrentScreen />
      <PreviewBanner />
    </>
  )
}
