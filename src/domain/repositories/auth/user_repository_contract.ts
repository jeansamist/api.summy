import User from '#models/auth/user'
import { ModelProps } from '#utils/generics'

export abstract class UserRepositoryContract {
  abstract findByEmail(email: string): Promise<User | null>

  abstract findByEmailAndResetPasswordToken(
    email: string,
    resetPasswordToken: string
  ): Promise<User | null>

  abstract findByEmailAndEmailVerificationCode(
    email: string,
    emailVerificationCode: string
  ): Promise<User | null>

  abstract findById(id: number): Promise<User | null>

  abstract create(data: ModelProps<User>): Promise<User>

  abstract update(user: User, data: Partial<ModelProps<User>>): Promise<User>

  abstract delete(user: User): Promise<void>

  abstract deleteByEmail(email: string): Promise<void>

  abstract deleteById(id: number): Promise<void>

  abstract verifyCredentials(email: string, password: string): Promise<User>
}
