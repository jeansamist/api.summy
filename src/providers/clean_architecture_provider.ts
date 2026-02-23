import { QueueManagerContract } from '#domain/queues/queue_manager_contract'
import { AgentRepositoryContract } from '#domain/repositories/agents/agent_repository_contract'
import { UserRepositoryContract } from '#domain/repositories/auth/user_repository_contract'
import { AuthNotificationServiceContract } from '#domain/services/auth/auth_notification_service_contract'
import { AuthNotificationService } from '#infrastructure/services/auth/auth_notification_service'
import CronManager from '#queues/cron_manager'
import AgentRepository from '#repositories/agents/agent_repository'
import UserRepository from '#repositories/auth/user_repository'
import type { ApplicationService } from '@adonisjs/core/types'

export default class CleanArchitectureProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(UserRepositoryContract, async (resolver) => {
      return resolver.make(UserRepository)
    })

    this.app.container.singleton(AgentRepositoryContract, async (resolver) => {
      return resolver.make(AgentRepository)
    })

    this.app.container.singleton(AuthNotificationServiceContract, async (resolver) => {
      return resolver.make(AuthNotificationService)
    })

    this.app.container.singleton(QueueManagerContract, async (resolver) => {
      return resolver.make(CronManager)
    })
  }
}
