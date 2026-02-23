import type { UserEntity } from '#domain/entities/auth/user_entity'
import { QueueManagerContract } from '#domain/queues/queue_manager_contract'
import { AuthNotificationServiceContract } from '#domain/services/auth/auth_notification_service_contract'
import EmailVerificationCodeNotification from '#mails/auth/email_verification_code_notification'
import LoginAlertNotification from '#mails/auth/login_alert_notification'
import PasswordResetAlertNotification from '#mails/auth/password_reset_alert_notification'
import PasswordResetNotification from '#mails/auth/password_reset_notification'
import WelcomeNotification from '#mails/auth/welcome_notification'
import { EMAIL_QUEUE_NAME } from '#shared/constants/auth_constants'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import { BaseMail } from '@adonisjs/mail'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

@inject()
export class AuthNotificationService implements AuthNotificationServiceContract {
  constructor(
    private readonly queueManager: QueueManagerContract,
    private readonly logger: Logger
  ) {}

  sendPasswordResetEmail(user: UserEntity) {
    const resetPasswordLink =
      env.get('FRONTEND_APP_URL') +
      '/auth/reset-password?resetPasswordToken=' +
      user.resetPasswordToken

    this.queueMail(
      'Send reset password email',
      new PasswordResetNotification(user, resetPasswordLink)
    )
  }

  sendPasswordResetAlertNotification(user: UserEntity) {
    this.queueMail(
      'Send password reset alert email',
      new PasswordResetAlertNotification(
        user,
        `${DateTime.now().toUTC().toFormat('yyyy-LL-dd HH:mm:ss')} UTC`
      )
    )
  }

  sendEmailVerificationCodeNotification(user: UserEntity) {
    this.queueMail(
      'Send email verification code email',
      new EmailVerificationCodeNotification(user)
    )
  }

  sendWelcomeNotification(user: UserEntity) {
    this.queueMail('Send welcome email', new WelcomeNotification(user))
  }

  sendLoginAlertNotification(user: UserEntity) {
    this.queueMail(
      'Send login alert email',
      new LoginAlertNotification(
        user,
        `${DateTime.now().toUTC().toFormat('yyyy-LL-dd HH:mm:ss')} UTC`
      )
    )
  }

  private queueMail(logMessage: string, notification: BaseMail) {
    this.queueManager.addQueueJob(
      EMAIL_QUEUE_NAME,
      async () => {
        this.logger.info(logMessage)
        await mail.send(notification)
      },
      { retries: 2, retryDelayMs: 1000 }
    )
  }
}
