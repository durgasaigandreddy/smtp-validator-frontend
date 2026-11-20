import { Badge } from '../../../components/Badge'
import { Button } from '../../../components/Button'
import { Cell, DataTable, Row } from '../../../components/DataTable'
import { Panel } from '../../../components/Panel'
import { QueryBoundary } from '../../../components/QueryBoundary'
import { useAuth } from '../../../auth'
import { formatRelativeDay } from '../../../lib/format'
import { useListApiKeys, useRevokeApiKey } from '../../../api'
import { CreateKeyForm } from './CreateKeyForm'

export const ApiKeysPanel = () => {
  const { session } = useAuth()
  const { data: apiKeys, isPending, error } = useListApiKeys()
  const revokeKey = useRevokeApiKey()

  return (
    <Panel title="API keys" delay={340}>
      <QueryBoundary isLoading={isPending} error={error}>
        <DataTable headers={['Name', 'Type', 'Status', 'Created', '']}>
          {apiKeys?.map((apiKey) => (
            <Row key={apiKey.id}>
              <Cell className="font-medium">{apiKey.name}</Cell>
              <Cell>
                <Badge tone={apiKey.is_admin ? 'accent' : 'neutral'}>
                  {apiKey.is_admin ? 'Admin' : 'Client'}
                </Badge>
              </Cell>
              <Cell>
                {apiKey.active ? (
                  <Badge tone="valid">Active</Badge>
                ) : (
                  <Badge tone="neutral">Revoked</Badge>
                )}
              </Cell>
              <Cell className="text-ink-soft">{formatRelativeDay(apiKey.created_at)}</Cell>
              <Cell>
                <div className="flex justify-end">
                  {apiKey.id === session?.identity.id ? (
                    <span className="text-[12px] text-ink-faint">In use</span>
                  ) : (
                    apiKey.active && (
                      <Button
                        variant="danger"
                        size="small"
                        disabled={revokeKey.isPending}
                        onClick={() => revokeKey.mutate(apiKey.id)}
                      >
                        Revoke
                      </Button>
                    )
                  )}
                </div>
              </Cell>
            </Row>
          ))}
        </DataTable>
      </QueryBoundary>

      {revokeKey.error && (
        <p role="alert" className="mt-3 text-[13px] font-medium text-danger">
          {revokeKey.error.message}
        </p>
      )}

      <CreateKeyForm />
    </Panel>
  )
}
