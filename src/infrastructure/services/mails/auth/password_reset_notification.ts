import { ResetPasswordEmailTemplate } from '#mail_templates/auth/reset_password_email_template'
import type { UserEntity } from '#domain/entities/auth/user_entity'
import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'
import { render } from '@react-email/render'

export default class PasswordResetNotification extends BaseMail {
  from = env.get('SMTP_USERNAME')
  subject = 'Summy - Recover your password'
  constructor(
    private user: UserEntity,
    private resetPasswordLink: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  async prepare() {
    this.message.to(this.user.email)
    this.message.html(
      await render(
        ResetPasswordEmailTemplate({
          firstName: this.user.firstName,
          resetPasswordLink: this.resetPasswordLink,
        })
      )
    )
  }
}
