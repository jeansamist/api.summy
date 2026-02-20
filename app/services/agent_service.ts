import Agent from '#models/agent'
import AgentRepository from '#repositories/agent_repository'
import { ModelProps } from '#utils/generics'
import { inject } from '@adonisjs/core'

type CreateAgentPayload = {
  name: string
  systemPrompt?: string
  knowlage?: string
}

@inject()
export class AgentService {
  constructor(private readonly repository: AgentRepository) {}

  async listByUserId(userId: number) {
    return this.repository.listByUserId(userId)
  }

  async create(userId: number, data: CreateAgentPayload) {
    return this.repository.create({
      userId,
      name: data.name,
      systemPrompt: data.systemPrompt ?? null,
      knowlage: data.knowlage ?? null,
    })
  }

  async findByIdAndUserId(id: number, userId: number) {
    return this.repository.findByIdAndUserId(id, userId)
  }

  async update(
    agent: Agent,
    data: Partial<Pick<ModelProps<Agent>, 'name' | 'systemPrompt' | 'knowlage'>>
  ) {
    return this.repository.update(agent, data)
  }

  async delete(agent: Agent) {
    return this.repository.delete(agent)
  }
}
