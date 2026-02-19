import User from '#models/user'
import UserRepository from '#repositories/user_repository'
import { ModelProps } from '#utils/generics'
import { inject } from '@adonisjs/core'
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
    const restOfData = {
      avatar: null,
      emailVerificationCode: verificationCode,
      emailVerificationCodeExpiresAt: null,
      emailVerified: false,
      emailVerifiedAt: null,
      resetPasswordToken: null,
      resetPasswordTokenExpiresAt: null,
    } satisfies Omit<ModelProps<User>, 'firstName' | 'lastName' | 'email' | 'password'>
    return this.userRepository.create({ ...data, ...restOfData })
  }
}
