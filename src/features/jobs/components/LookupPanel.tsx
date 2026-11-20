import { useState } from 'react'
import {
  isNotFound,
  useCreateJobFromEmails,
  useLookupEmail,
  type EmailResult,
} from '../../../api'
import { Button } from '../../../components/Button'
import { FieldError } from '../../../components/Callout'
import { Panel } from '../../../components/Panel'
import { TextField } from '../../../components/TextField'
import { VerdictResultCard } from './VerdictResultCard'

export const LookupPanel = ({ onJobCreated }: { onJobCreated: (jobId: number) => void }) => {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<EmailResult | null>(null)
  const [notCheckedYet, setNotCheckedYet] = useState('')
  const [error, setError] = useState('')

  const lookup = useLookupEmail()
  const createJob = useCreateJobFromEmails()

  const reset = () => {
    setResult(null)
    setNotCheckedYet('')
    setError('')
  }

  const search = () => {
    const trimmed = email.trim()
    reset()
    if (!trimmed) {
      setError('Enter an email address.')
      return
    }
    lookup.mutate(trimmed, {
      onSuccess: setResult,
      onError: (cause: Error) =>
        isNotFound(cause) ? setNotCheckedYet(trimmed) : setError(cause.message),
    })
  }

  const checkNow = () => {
    createJob.mutate(
      { emails: [notCheckedYet], name: notCheckedYet },
      {
        onSuccess: ({ job_id }) => {
          reset()
          onJobCreated(job_id)
        },
        onError: (cause: Error) => setError(cause.message),
      },
    )
  }

  return (
    <Panel
      title="Look up one address"
      description="Check a single mailbox against stored results."
      delay={120}
    >
      <div className="flex flex-wrap items-end gap-2.5">
        <TextField
          className="min-w-[190px] flex-1"
          label="Email address"
          type="email"
          placeholder="priya.sharma@example.org"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && search()}
        />
        <Button disabled={lookup.isPending} onClick={search}>
          {lookup.isPending ? 'Looking…' : 'Look up'}
        </Button>
      </div>

      <FieldError>{error}</FieldError>

      {result && <VerdictResultCard result={result} />}

      {notCheckedYet && (
        <div className="animate-rise mt-4 rounded-xl bg-surface-sunken p-4">
          <p className="text-[13px] text-ink-soft">
            <strong className="break-all text-ink">{notCheckedYet}</strong> has not been checked yet.
          </p>
          <Button
            className="mt-3"
            variant="quiet"
            size="small"
            disabled={createJob.isPending}
            onClick={checkNow}
          >
            {createJob.isPending ? 'Starting…' : 'Check it now'}
          </Button>
        </div>
      )}
    </Panel>
  )
}
