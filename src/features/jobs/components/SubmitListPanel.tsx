import { useState } from 'react'
import { Button } from '../../../components/Button'
import { FieldError } from '../../../components/Callout'
import { DropZone } from '../../../components/DropZone'
import { Panel } from '../../../components/Panel'
import { TextField } from '../../../components/TextField'
import { useCreateJobFromCsv } from '../../../api'

export const SubmitListPanel = ({ onJobCreated }: { onJobCreated: (jobId: number) => void }) => {
  const [file, setFile] = useState<File | null>(null)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [error, setError] = useState('')
  const createJob = useCreateJobFromCsv()

  const start = () => {
    if (!file) {
      setError('Choose a CSV file first.')
      return
    }
    setError('')
    createJob.mutate(
      { file, webhookUrl: webhookUrl.trim() || undefined },
      {
        onSuccess: ({ job_id }) => {
          setFile(null)
          setWebhookUrl('')
          onJobCreated(job_id)
        },
        onError: (cause: Error) => setError(cause.message),
      },
    )
  }

  return (
    <Panel
      title="Check a list"
      description="Results for addresses seen in the last 30 days come back instantly."
      delay={60}
    >
      <DropZone accept=".csv,text/csv" selectedFile={file} onSelect={setFile} />

      <TextField
        className="mt-4"
        label="Notify me when finished"
        hint="optional"
        type="url"
        placeholder="https://your-app.example/hook"
        value={webhookUrl}
        onChange={(event) => setWebhookUrl(event.target.value)}
      />

      <FieldError>{error}</FieldError>

      <Button className="mt-4" fullWidth disabled={createJob.isPending} onClick={start}>
        {createJob.isPending ? 'Starting…' : 'Start check'}
      </Button>
    </Panel>
  )
}
