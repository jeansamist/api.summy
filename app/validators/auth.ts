import vine from '@vinejs/vine'
import { createUserValidator } from './user.js'

export const signUpValidator = createUserValidator

export const signInValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string().minLength(8),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    resetPasswordToken: vine.string().minLength(4),
    newPassword: vine.string().minLength(8),
  })
)
