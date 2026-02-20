import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(2),
    lastName: vine.string().minLength(2),
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string().minLength(8),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    avatar: vine.string().optional(),
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
  })
)
