export const AuthEvents = {
  UserSignedUp: 'auth:user_signed_up',
  UserSignedIn: 'auth:user_signed_in',
  UserVerifiedEmail: 'auth:user_verified_email',
  UserRequestedPasswordReset: 'auth:user_requested_password_reset',
  UserResetPassword: 'auth:user_reset_password',
} as const

export type AuthEventName = (typeof AuthEvents)[keyof typeof AuthEvents]
