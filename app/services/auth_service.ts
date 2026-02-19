import EmailVerificationCodeNotification from '#mails/email_verification_code_notification'
import PasswordResetNotification from '#mails/password_reset_notification'
import WelcomeNotification from '#mails/welcome_notification'
import User from '#models/user'
import UserRepository from '#repositories/user_repository'
import env from '#start/env'
import { ModelProps } from '#utils/generics'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { inject } from '@adonisjs/core'
import { cuid } from '@adonisjs/core/helpers'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import { randomInt } from 'node:crypto'

@inject()
export class AuthService {
  // Your code here
  constructor(protected readonly userRepository: UserRepository) {}

  generateVerificationCode() {
    return randomInt(100000, 1000000).toString()
  }

  async signUp(data: Pick<ModelProps<User>, 'firstName' | 'lastName' | 'email' | 'password'>) {
    const verificationCode = this.generateVerificationCode()
    const verificationCodeExpiresAt = DateTime.now().plus({ hours: 1 })
    const restOfData = {
      avatar: null,
      emailVerificationCode: verificationCode,
      emailVerificationCodeExpiresAt: verificationCodeExpiresAt,
      emailVerified: false,
      emailVerifiedAt: null,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    } satisfies Omit<ModelProps<User>, 'firstName' | 'lastName' | 'email' | 'password'>
    const user = await this.userRepository.create({ ...data, ...restOfData })

    await this.sendEmailVerificationCodeNotification(user)
    return user
  }

  async signIn(data: Pick<ModelProps<User>, 'email' | 'password'>) {
    const user = await User.verifyCredentials(data.email, data.password)
    // Check if email is verified
    if (!user.emailVerified) {
      throw new Error(
        'Please verify your email address before signing in. Check your email for the verification code.'
      )
    }
    return user
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findBy('email', normalizedEmail)
    if (!user) {
      throw new Error('User does not exist')
    }
    const resetPasswordToken = this.generateResetPasswordToken()
    const resetPasswordTokenExpiresAt = DateTime.now().plus({ hours: 1 })

    await this.sendPasswordResetEmail(
      await this.userRepository.update(user, {
        resetPasswordToken,
        resetPasswordTokenExpiresAt,
      })
    )
  }

  generateResetPasswordToken() {
    return cuid()
  }

  async sendPasswordResetEmail(user: User) {
    const resetPasswordLink =
      env.get('FRONTEND_APP_URL') + '/auth/reset-password?resetCode=' + user.resetPasswordToken
    const notification = new PasswordResetNotification(user, resetPasswordLink)
    await mail.send(notification)
  }

  async sendEmailVerificationCodeNotification(user: User) {
    const notification = new EmailVerificationCodeNotification(user)
    await mail.send(notification)
  }

  async sendWelcomeNotification(user: User) {
    const notification = new WelcomeNotification(user)
    await mail.send(notification)
  }

  /**
   * Generate access token for a user
   */
  async generateAccessToken(user: User, auth: Authenticator<Authenticators>) {
    return await auth.use('api').createToken(user, ['*'], { expiresIn: '30d' })
  }

  /**
   * Delete/invalidate access token
   */
  async deleteAccessToken(auth: Authenticator<Authenticators>) {
    return await auth.use('api').invalidateToken()
  }

  async verifyEmail(email: string, emailVerificationCode: string) {
    const user = await this.userRepository.findByEmailAndEmailVerificationCode(
      email,
      emailVerificationCode
    )
    if (!user) return false

    if (user.emailVerificationCode !== emailVerificationCode) {
      return false
    }
    if (
      user.emailVerificationCodeExpiresAt &&
      user.emailVerificationCodeExpiresAt < DateTime.now()
    ) {
      return false
    }
    await this.userRepository.update(user, {
      emailVerified: true,
      emailVerifiedAt: DateTime.now(),
    })
    await this.wipeEmailVerificationCode(user)
    await this.sendWelcomeNotification(user)
    return user
  }

  async wipeResetPasswordToken(user: User) {
    await this.userRepository.update(user, {
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    })
  }
  async wipeEmailVerificationCode(user: User) {
    await this.userRepository.update(user, {
      emailVerificationCode: null,
      emailVerificationCodeExpiresAt: null,
    })
  }
}
