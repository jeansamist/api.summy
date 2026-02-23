import type { DateTime } from 'luxon'

export interface AgentEntity {
  id: number
  userId: number
  name: string
  systemPrompt: string | null
  knowlage: string | null
  createdAt: DateTime
  updatedAt: DateTime | null
}
