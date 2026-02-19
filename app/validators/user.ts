import User from '#models/user'
import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(2),
    lastName: vine.string().minLength(2),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, email) => {
        const userReq = await db.from('users').where('email', email).first()
        if (userReq) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { id, email_verified } = userReq as { id: number; email_verified: boolean }
          if (!email_verified) {
            const user = await User.findOrFail(id)
            await user.delete()
            return true
          } else {
            return false
          }
        }
        return true
      }),
    password: vine.string().minLength(8),
  })
)
