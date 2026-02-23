import Agent from '#models/agents/agent'
import { ModelProps } from '#utils/generics'

export abstract class AgentRepositoryContract {
  abstract listByUserId(userId: number): Promise<Agent[]>

  abstract findByIdAndUserId(id: number, userId: number): Promise<Agent | null>

  abstract create(data: ModelProps<Agent>): Promise<Agent>

  abstract update(agent: Agent, data: Partial<ModelProps<Agent>>): Promise<Agent>

  abstract delete(agent: Agent): Promise<void>
}
