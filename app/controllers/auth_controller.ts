import { AuthService } from '#services/auth_service'
import { ApiResponse } from '#utils/api_response'
import {
  forgotPasswordValidator,
  signInValidator,
  signUpValidator,
  verifyEmailValidator,
} from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(protected authService: AuthService) {}
  async signUp({ request, response, auth }: HttpContext) {
    if (auth.isAuthenticated) {
      return response.conflict(ApiResponse.failure(null, 'You can not sign up while logged in'))
    }
    const data = await request.validateUsing(signUpValidator)
    await this.authService.signUp(data)
    return response.ok(ApiResponse.success(null, 'User created successfully'))
  }

  async verifyEmail({ request, response, auth }: HttpContext) {
    if (auth.isAuthenticated) {
      return response.conflict(
        ApiResponse.failure(null, 'You can not reverify email while logged in')
      )
    }
    const { email, emailVerificationCode } = await request.validateUsing(verifyEmailValidator)
    const user = await this.authService.verifyEmail(email, emailVerificationCode)
    if (user) {
      const accessToken = await this.authService.generateAccessToken(user, auth)
      return response.ok(ApiResponse.success({ accessToken }, 'Email verified successfully'))
    }
    return response.unauthorized(ApiResponse.failure(null, 'Invalid email verification code'))
  }

  async signIn({ request, response, auth }: HttpContext) {
    if (auth.isAuthenticated) {
      return response.conflict(ApiResponse.failure(null, 'You can not sign in while logged in'))
    }
    const data = await request.validateUsing(signInValidator)
    const user = await this.authService.signIn(data)
    const accessToken = await this.authService.generateAccessToken(user, auth)
    return response.ok(ApiResponse.success({ accessToken }, 'Signed in successfully'))
  }

  async forgotPassword({ request, response, auth }: HttpContext) {
    if (auth.isAuthenticated) {
      return response.conflict(ApiResponse.failure(null, 'You can not proceed while logged in'))
    }
    const { email } = await request.validateUsing(forgotPasswordValidator)
    await this.authService.forgotPassword(email)
    return response.ok(ApiResponse.success(null, 'Password reset email sent successfully'))
  }
}
