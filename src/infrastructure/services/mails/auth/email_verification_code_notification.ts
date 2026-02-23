import { EmailVerificationCodeEmailTemplate } from '#mail_templates/auth/email_verification_code_email_template'
import type { UserEntity } from '#domain/entities/auth/user_entity'
import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'
import { render } from '@react-email/render'

export default class EmailVerificationCodeNotification extends BaseMail {
  from = env.get('SMTP_USERNAME')
  subject = 'Summy email verification code'
  constructor(private user: UserEntity) {
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
        EmailVerificationCodeEmailTemplate({
          firstName: this.user.firstName,
          emailVerificationCode: this.user.emailVerificationCode ?? '',
        })
      )
    )
  }
}
