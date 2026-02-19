import { WelcomeEmailTemplate } from '#mail_templates/welcome_email_template'
import User from '#models/user'
import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'
import { render } from '@react-email/render'

export default class WelcomeNotification extends BaseMail {
  from = env.get('SMTP_USERNAME')
  subject = 'Welcome to Summy'
  constructor(private user: User) {
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
        WelcomeEmailTemplate({
          firstName: this.user.firstName,
        })
      )
    )
  }
}
