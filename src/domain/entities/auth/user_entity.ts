import type { DateTime } from 'luxon'

export interface UserEntity {
  id: number
  firstName: string
  lastName: string
  avatar: string | null
  email: string
  password: string
  resetPasswordToken: string | null
  resetPasswordTokenExpiresAt: DateTime | null
  emailVerified: boolean
  emailVerifiedAt: DateTime | null
  emailVerificationCode: string | null
  emailVerificationCodeExpiresAt: DateTime | null
  createdAt: DateTime
  updatedAt: DateTime | null
}
