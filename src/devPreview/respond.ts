import type { EmailResult, Verdict } from '../api/types'
import {
  addSampleJob,
  findSampleJob,
  recordSampleAudit,
  samples,
  toSampleJobDetail,
} from './samples'

const LATENCY_MS = 220

const CLIENT_KEY_HINT = 'user'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const detail = (message: string, status: number) => json({ detail: message }, status)

const noContent = () => new Response(null, { status: 204 })

const csv = (body: string) => new Response(body, { status: 200, headers: { 'Content-Type': 'text/csv' } })

const reasonFor: Record<Verdict, string> = {
  valid: 'the mail server accepted this address',
  invalid: 'the mail server rejected this address',
  catch_all: 'the domain accepts every address, so this tells us nothing',
  unknown: 'no clear answer from the server',
}

const verdictForEmail = (email: string): Verdict => {
  const sum = [...email].reduce((total, character) => total + character.charCodeAt(0), 0)
  const order: Verdict[] = ['valid', 'valid', 'invalid', 'catch_all', 'unknown']
  return order[sum % order.length]
}

const providerFor = (email: string) => {
  const domain = email.split('@')[1] ?? ''
  if (domain.includes('gmail') || domain.includes('google')) return 'Google'
  if (domain.includes('outlook') || domain.includes('hotmail')) return 'Microsoft'
  if (domain.includes('yahoo')) return 'Yahoo'
  return 'Other'
}

const idFromPath = (path: string, index: number) => Number(path.split('/')[index])

const resolve = async (path: string, method: string, apiKey: string, body?: unknown) => {
  const [route, query = ''] = path.split('?')

  if (route === '/admin/status') {
    if (apiKey.toLowerCase().includes(CLIENT_KEY_HINT)) {
      return detail('Admin access is needed for this.', 403)
    }
    return json({
      queued: samples.jobs.reduce((total, job) => total + toSampleJobDetail(job).pending, 0),
      running: samples.jobs.filter((job) => !toSampleJobDetail(job).finished).length,
      checked_today: samples.ips.reduce((total, ip) => total + ip.used_today, 0),
      ips: samples.ips,
    })
  }

  if (route === '/v1/jobs' && method === 'GET') {
    return json(
      samples.jobs.map((job) => {
        const { id, name, total, finished, created_at } = toSampleJobDetail(job)
        return { id, name, total, finished, created_at }
      }),
    )
  }

  if (route === '/v1/jobs' && method === 'POST') {
    const emails = (body as { emails?: string[] })?.emails ?? []
    const name = (body as { name?: string })?.name
    const job = addSampleJob(name ?? `${emails.length} address check`, emails.length)
    return json({ job_id: job.id, total: job.total })
  }

  if (route === '/v1/jobs/upload') {
    const file = (body as FormData)?.get('file')
    const name = file instanceof File ? file.name : 'upload.csv'
    const rows = file instanceof File ? Math.max(1, Math.round(file.size / 24)) : 250
    const job = addSampleJob(name, rows)
    return json({ job_id: job.id, total: job.total })
  }

  if (route.endsWith('/results.csv')) {
    const jobId = idFromPath(route, 3)
    const job = findSampleJob(jobId)
    if (!job) return detail(`Job #${jobId} was not found.`, 404)
    const rows = Array.from({ length: Math.min(toSampleJobDetail(job).done, 50) }, (_, index) => {
      const email = `person${index + 1}@example.org`
      const verdict = verdictForEmail(email)
      return `${email},${verdict},"${reasonFor[verdict]}",${providerFor(email)}`
    })
    recordSampleAudit('Client app', `Downloaded job #${jobId}`)
    return csv(`email,verdict,reason,provider\n${rows.join('\n')}`)
  }

  if (route.startsWith('/v1/jobs/')) {
    const jobId = idFromPath(route, 3)
    const job = findSampleJob(jobId)
    return job ? json(toSampleJobDetail(job)) : detail(`Job #${jobId} was not found.`, 404)
  }

  if (route === '/v1/result') {
    const email = decodeURIComponent(new URLSearchParams(query).get('email') ?? '')
    if (email.endsWith('@unknown.test')) return detail('This address has not been checked yet.', 404)
    const verdict = verdictForEmail(email)
    const result: EmailResult = {
      email,
      verdict,
      reason: reasonFor[verdict],
      provider: providerFor(email),
      checked_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    }
    return json(result)
  }

  if (route.endsWith('/pause') || route.endsWith('/resume')) {
    const ip = decodeURIComponent(route.split('/')[3])
    const target = samples.ips.find((candidate) => candidate.ip === ip)
    if (!target) return detail(`IP ${ip} was not found.`, 404)
    const pausing = route.endsWith('/pause')
    target.state = pausing ? 'paused' : 'active'
    target.pause_reason = pausing ? 'paused manually' : null
    recordSampleAudit('Admin', `${pausing ? 'Paused' : 'Resumed'} IP ${ip}`)
    return noContent()
  }

  if (route === '/admin/keys' && method === 'GET') return json(samples.apiKeys)

  if (route === '/admin/keys' && method === 'POST') {
    const { name, admin } = body as { name: string; admin: boolean }
    const summary = {
      id: samples.nextKeyId++,
      name,
      is_admin: admin,
      active: true,
      created_at: new Date().toISOString(),
    }
    samples.apiKeys.push(summary)
    recordSampleAudit('Admin', `Created key "${name}"`)
    const random = crypto.getRandomValues(new Uint8Array(16))
    const suffix = [...random].map((byte) => byte.toString(16).padStart(2, '0')).join('')
    return json({ ...summary, api_key: `ev_preview_${suffix}` })
  }

  if (route.startsWith('/admin/keys/') && method === 'DELETE') {
    const keyId = idFromPath(route, 3)
    const target = samples.apiKeys.find((candidate) => candidate.id === keyId)
    if (!target) return detail('That key was not found.', 404)
    target.active = false
    recordSampleAudit('Admin', `Revoked key "${target.name}"`)
    return noContent()
  }

  if (route === '/admin/audit') {
    const limit = Number(new URLSearchParams(query).get('limit') ?? 6)
    return json(samples.audit.slice(0, limit))
  }

  return detail(`No preview response for ${method} ${route}.`, 404)
}

export const devPreviewResponse = async (
  path: string,
  method: string,
  apiKey: string,
  body?: unknown,
) => {
  const response = await resolve(path, method, apiKey, body)
  await new Promise((settle) => setTimeout(settle, LATENCY_MS))
  return response
}
