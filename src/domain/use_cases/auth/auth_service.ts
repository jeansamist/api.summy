import { EmailAlreadyTakenException } from '#domain/exceptions/auth/email_already_taken_exception'
import { EmailNotVerifiedException } from '#domain/exceptions/auth/email_not_verified_exception'
import { UserNotFoundException } from '#domain/exceptions/auth/user_not_found_exception'
import { UserRepositoryContract } from '#domain/repositories/auth/user_repository_contract'
import { AuthNotificationServiceContract } from '#domain/services/auth/auth_notification_service_contract'
import { EmailAddress } from '#domain/value_objects/email_address'
import User from '#models/auth/user'
import type { ResetPasswordRequestDto } from '#shared/dtos/requests/auth/reset_password_request_dto'
import type { SignInRequestDto } from '#shared/dtos/requests/auth/sign_in_request_dto'
import type { SignUpRequestDto } from '#shared/dtos/requests/auth/sign_up_request_dto'
import { ModelProps } from '#utils/generics'
import { inject } from '@adonisjs/core'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'
import { randomInt } from 'node:crypto'

@inject()
export class AuthService {
  constructor(
    protected readonly userRepository: UserRepositoryContract,
    protected readonly authNotificationService: AuthNotificationServiceContract
  ) {}

  generateVerificationCode() {
    return randomInt(100000, 1000000).toString()
  }

  async signUp(data: SignUpRequestDto) {
    const normalizedEmail = EmailAddress.normalize(data.email)
    const payload = {
      ...data,
      email: normalizedEmail,
    }
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
    const existingUser = await this.userRepository.findByEmail(normalizedEmail)
    if (existingUser) {
      if (existingUser.emailVerified) {
        throw new EmailAlreadyTakenException()
      }
      // Update the unverified user
      await this.userRepository.update(existingUser, { ...payload, ...restOfData })
      return existingUser
    }
    const user = await this.userRepository.create({ ...payload, ...restOfData })
    this.authNotificationService.sendEmailVerificationCodeNotification(user)
    return user
  }

  async signIn(data: SignInRequestDto) {
    const user = await this.userRepository.verifyCredentials(
      EmailAddress.normalize(data.email),
      data.password
    )
    // Check if email is verified
    if (!user.emailVerified) {
      throw new EmailNotVerifiedException()
    }
    this.authNotificationService.sendLoginAlertNotification(user)
    return user
  }

  async forgotPassword(email: string) {
    const normalizedEmail = EmailAddress.normalize(email)
    const user = await this.userRepository.findByEmail(normalizedEmail)
    if (!user) {
      throw new UserNotFoundException()
    }
    const resetPasswordToken = this.generateResetPasswordToken()
    const resetPasswordTokenExpiresAt = DateTime.now().plus({ hours: 1 })

    this.authNotificationService.sendPasswordResetEmail(
      await this.userRepository.update(user, {
        resetPasswordToken,
        resetPasswordTokenExpiresAt,
      })
    )
  }

  async resetPassword(data: ResetPasswordRequestDto) {
    const normalizedEmail = EmailAddress.normalize(data.email)
    const user = await this.userRepository.findByEmailAndResetPasswordToken(
      normalizedEmail,
      data.resetPasswordToken
    )
    if (!user) return false
    if (user.resetPasswordTokenExpiresAt && user.resetPasswordTokenExpiresAt < DateTime.now()) {
      return false
    }
    await this.userRepository.update(user, {
      password: data.newPassword,
    })
    await this.wipeResetPasswordToken(user)
    this.authNotificationService.sendPasswordResetAlertNotification(user)
    return true
  }

  async deleteAccount(user: User) {
    return this.userRepository.delete(user)
  }

  async updateProfile(user: User, payload: Partial<ModelProps<User>>) {
    return this.userRepository.update(user, payload)
  }

  generateResetPasswordToken() {
    return cuid()
  }

  async verifyEmail(email: string, emailVerificationCode: string) {
    const normalizedEmail = EmailAddress.normalize(email)
    const user = await this.userRepository.findByEmailAndEmailVerificationCode(
      normalizedEmail,
      emailVerificationCode
    )
    if (!user) return false
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
    this.authNotificationService.sendWelcomeNotification(user)
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
