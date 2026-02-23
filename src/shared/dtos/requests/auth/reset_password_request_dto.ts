export type ResetPasswordRequestDto = {
  email: string
  resetPasswordToken: string
  newPassword: string
}
