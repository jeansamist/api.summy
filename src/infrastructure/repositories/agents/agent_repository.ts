import { AgentRepositoryContract } from '#domain/repositories/agents/agent_repository_contract'
import Agent from '#models/agents/agent'
import { ModelProps } from '#utils/generics'

export default class AgentRepository extends AgentRepositoryContract {
  private model = Agent

  get getModel(): typeof Agent {
    return this.model
  }

  async listByUserId(userId: number): Promise<Agent[]> {
    return this.model.query().where('user_id', userId).orderBy('id', 'desc')
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Agent | null> {
    return this.model.query().where('id', id).where('user_id', userId).first()
  }

  async create(data: ModelProps<Agent>): Promise<Agent> {
    return this.model.create(data)
  }

  async update(agent: Agent, data: Partial<ModelProps<Agent>>): Promise<Agent> {
    return agent.merge(data).save()
  }

  async delete(agent: Agent): Promise<void> {
    await agent.delete()
  }
}
