import { useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { useAuth } from '../../auth'
import { JobProgressPanel } from './components/JobProgressPanel'
import { LookupPanel } from './components/LookupPanel'
import { RecentJobsPanel } from './components/RecentJobsPanel'
import { SubmitListPanel } from './components/SubmitListPanel'

export const UserPage = () => {
  const { session, signOut } = useAuth()
  const [openJobId, setOpenJobId] = useState<number | null>(null)

  return (
    <AppShell
      subtitle="Address verification"
      identityName={session?.identity.name ?? ''}
      isAdmin={false}
      onSignOut={signOut}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <SubmitListPanel onJobCreated={setOpenJobId} />
        <LookupPanel onJobCreated={setOpenJobId} />
      </div>

      {openJobId !== null && <JobProgressPanel jobId={openJobId} />}

      <RecentJobsPanel onOpenJob={setOpenJobId} />
    </AppShell>
  )
}
