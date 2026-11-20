import type { Verdict } from '../../api'

export interface VerdictPresentation {
  label: string
  meaning: string
  color: string
  background: string
}

export const verdictPresentation: Record<Verdict, VerdictPresentation> = {
  valid: {
    label: 'Valid',
    meaning: 'The mailbox exists',
    color: 'var(--valid)',
    background: 'var(--valid-bg)',
  },
  invalid: {
    label: 'Invalid',
    meaning: 'Rejected, or no mail server',
    color: 'var(--invalid)',
    background: 'var(--invalid-bg)',
  },
  catch_all: {
    label: 'Catch-all',
    meaning: 'Domain accepts everything',
    color: 'var(--warn)',
    background: 'var(--warn-bg)',
  },
  unknown: {
    label: 'Unknown',
    meaning: 'No clear answer from the server',
    color: 'var(--neutral)',
    background: 'var(--neutral-bg)',
  },
}

export const verdictOrder: Verdict[] = ['valid', 'invalid', 'catch_all', 'unknown']
