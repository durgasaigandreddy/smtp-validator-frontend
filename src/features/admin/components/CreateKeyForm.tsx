import { useState } from 'react'
import { useCreateApiKey, type CreatedApiKey } from '../../../api'
import { Button } from '../../../components/Button'
import { Callout, FieldError } from '../../../components/Callout'
import { Switch } from '../../../components/Switch'
import { TextField } from '../../../components/TextField'

export const CreateKeyForm = () => {
  const [name, setName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<CreatedApiKey | null>(null)
  const createKey = useCreateApiKey()

  const submit = () => {
    const trimmed = name.trim()
    setError('')
    if (!trimmed) {
      setError('Give the key a name first.')
      return
    }
    createKey.mutate(
      { name: trimmed, admin: isAdmin },
      {
        onSuccess: (result) => {
          setCreated(result)
          setName('')
          setIsAdmin(false)
        },
        onError: (cause: Error) => setError(cause.message),
      },
    )
  }

  return (
    <div className="mt-5 border-t border-hairline pt-5">
      <div className="flex flex-wrap items-end gap-3">
        <TextField
          className="min-w-[180px] flex-1"
          label="Create a new key"
          placeholder="For example, Billing app"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && submit()}
        />
        <div className="min-h-11 content-center">
          <Switch label="Admin access" checked={isAdmin} onChange={setIsAdmin} />
        </div>
        <Button disabled={createKey.isPending} onClick={submit}>
          {createKey.isPending ? 'Creating…' : 'Create key'}
        </Button>
      </div>

      <FieldError>{error}</FieldError>

      {created && (
        <Callout tone="accent" className="mt-3">
          <strong>Copy this key now. It will not be shown again.</strong>
          <code className="mt-1.5 block font-mono text-[13px] break-all">{created.api_key}</code>
        </Callout>
      )}
    </div>
  )
}
