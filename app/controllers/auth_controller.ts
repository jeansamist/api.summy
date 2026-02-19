import { AuthService } from '#services/auth_service'
import { ApiResponse } from '#utils/api_response'
import { signUpValidator } from '#validators/auth'
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
}
