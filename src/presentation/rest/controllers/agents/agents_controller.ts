import { AgentService } from '#services/agents/agent_service'
import { ApiResponse } from '#shared/dtos/responses/api_response'
import { createAgentValidator, updateAgentValidator } from '#validators/agents/agent'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AgentsController {
  constructor(private readonly agentService: AgentService) {}

  async index({ auth, response }: HttpContext) {
    if (!auth.user) return response.unauthorized(ApiResponse.failure(null, 'You are not logged in'))
    const agents = await this.agentService.listByUserId(auth.user.id)
    return response.ok(ApiResponse.success(agents, 'Agents fetched successfully'))
  }

  async store({ auth, request, response }: HttpContext) {
    if (!auth.user) return response.unauthorized(ApiResponse.failure(null, 'You are not logged in'))
    const payload = await request.validateUsing(createAgentValidator)
    const agent = await this.agentService.create(auth.user.id, payload)
    return response.created(ApiResponse.success(agent, 'Agent created successfully'))
  }

  async show({ auth, params, response }: HttpContext) {
    if (!auth.user) return response.unauthorized(ApiResponse.failure(null, 'You are not logged in'))
    const agentId = Number(params.id)
    if (!Number.isInteger(agentId) || agentId <= 0) {
      return response.badRequest(ApiResponse.failure(null, 'Invalid agent id'))
    }
    const agent = await this.agentService.findByIdAndUserId(agentId, auth.user.id)
    if (!agent) return response.notFound(ApiResponse.failure(null, 'Agent not found'))
    return response.ok(ApiResponse.success(agent, 'Agent fetched successfully'))
  }

  async update({ auth, params, request, response }: HttpContext) {
    if (!auth.user) return response.unauthorized(ApiResponse.failure(null, 'You are not logged in'))
    const agentId = Number(params.id)
    if (!Number.isInteger(agentId) || agentId <= 0) {
      return response.badRequest(ApiResponse.failure(null, 'Invalid agent id'))
    }
    const agent = await this.agentService.findByIdAndUserId(agentId, auth.user.id)
    if (!agent) return response.notFound(ApiResponse.failure(null, 'Agent not found'))
    const payload = await request.validateUsing(updateAgentValidator)
    const updatedAgent = await this.agentService.update(agent, payload)
    return response.ok(ApiResponse.success(updatedAgent, 'Agent updated successfully'))
  }

  async destroy({ auth, params, response }: HttpContext) {
    if (!auth.user) return response.unauthorized(ApiResponse.failure(null, 'You are not logged in'))
    const agentId = Number(params.id)
    if (!Number.isInteger(agentId) || agentId <= 0) {
      return response.badRequest(ApiResponse.failure(null, 'Invalid agent id'))
    }
    const agent = await this.agentService.findByIdAndUserId(agentId, auth.user.id)
    if (!agent) return response.notFound(ApiResponse.failure(null, 'Agent not found'))
    await this.agentService.delete(agent)
    return response.ok(ApiResponse.success(null, 'Agent deleted successfully'))
  }
}
