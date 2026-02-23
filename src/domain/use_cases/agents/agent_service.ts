import { AgentRepositoryContract } from '#domain/repositories/agents/agent_repository_contract'
import Agent from '#models/agents/agent'
import type { CreateAgentRequestDto } from '#shared/dtos/requests/agents/create_agent_request_dto'
import type { UpdateAgentRequestDto } from '#shared/dtos/requests/agents/update_agent_request_dto'
import { ModelProps } from '#utils/generics'
import { inject } from '@adonisjs/core'

@inject()
export class AgentService {
  constructor(private readonly repository: AgentRepositoryContract) {}

  async listByUserId(userId: number) {
    return this.repository.listByUserId(userId)
  }

  async create(userId: number, data: CreateAgentRequestDto) {
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
    data: UpdateAgentRequestDto &
      Partial<Pick<ModelProps<Agent>, 'name' | 'systemPrompt' | 'knowlage'>>
  ) {
    return this.repository.update(agent, data)
  }

  async delete(agent: Agent) {
    return this.repository.delete(agent)
  }
}
