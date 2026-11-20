export interface ApiKeySummary {
  id: number
  name: string
  is_admin: boolean
  active: boolean
  created_at: string
}

export interface CreatedApiKey extends ApiKeySummary {
  api_key: string
}
