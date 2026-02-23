import type { UserEntity } from '#domain/entities/auth/user_entity'

export abstract class AuthNotificationServiceContract {
  abstract sendPasswordResetEmail(user: UserEntity): void

  abstract sendPasswordResetAlertNotification(user: UserEntity): void

  abstract sendEmailVerificationCodeNotification(user: UserEntity): void

  abstract sendWelcomeNotification(user: UserEntity): void

  abstract sendLoginAlertNotification(user: UserEntity): void
}
