import { useGetAdminStatus } from '../../api'
import { AppShell } from '../../components/AppShell'
import { QueryBoundary } from '../../components/QueryBoundary'
import { useAuth } from '../../auth'
import { ActivityPanel } from './components/ActivityPanel'
import { ApiKeysPanel } from './components/ApiKeysPanel'
import { AttentionBanner } from './components/AttentionBanner'
import { SendingIpsPanel } from './components/SendingIpsPanel'
import { SummaryTiles } from './components/SummaryTiles'

export const AdminPage = () => {
  const { session, signOut } = useAuth()
  const { data: status, isPending, error } = useGetAdminStatus()

  return (
    <AppShell
      subtitle="Operations"
      identityName={session?.identity.name ?? ''}
      isAdmin
      onSignOut={signOut}
    >
      <QueryBoundary isLoading={isPending} error={error}>
        {status && (
          <div className="grid gap-5">
            <AttentionBanner ips={status.ips} />
            <SummaryTiles status={status} />
            <SendingIpsPanel ips={status.ips} />
          </div>
        )}
      </QueryBoundary>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <ApiKeysPanel />
        <ActivityPanel />
      </div>
    </AppShell>
  )
}
