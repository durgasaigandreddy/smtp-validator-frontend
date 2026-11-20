import type { JobDetail } from '../../../api'
import { Cell, DataTable, Row } from '../../../components/DataTable'
import { formatCount } from '../../../lib/format'
import { verdictOrder, verdictPresentation } from '../../../lib/verdicts'

export const ProviderBreakdownTable = ({ job }: { job: JobDetail }) => (
  <DataTable
    headers={['Provider', ...verdictOrder.map((verdict) => verdictPresentation[verdict].label)]}
  >
    {job.by_provider.map((row) => (
      <Row key={row.provider}>
        <Cell className="font-medium">{row.provider}</Cell>
        {verdictOrder.map((verdict) => (
          <Cell key={verdict} className="numeric">
            {formatCount(row[verdict])}
          </Cell>
        ))}
      </Row>
    ))}
  </DataTable>
)
