/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router
  .group(() => {
    // Auth routes
    router
      .group(() => {
        router.post('sign-up', [AuthController, 'signUp'])
        router.post('sign-in', [AuthController, 'signIn'])
        router.post('verify-email', [AuthController, 'verifyEmail'])
        router.post('forgot-password', [AuthController, 'forgotPassword'])
        router.post('reset-password', [AuthController, 'resetPassword'])
        // router.post('resend-otp', [AuthController, 'resendOtp'])
        // router.post('google', [AuthController, 'signInWithGoogle'])

        // // Protected auth routes
        router.post('logout', [AuthController, 'logout']).use([middleware.auth()])
        router.get('profile', [AuthController, 'profile']).use([middleware.auth()])
        router.put('profile', [AuthController, 'updateProfile']).use([middleware.auth()])
        router.delete('delete-account', [AuthController, 'deleteAccount']).use([middleware.auth()])
      })
      .prefix('auth')
  })
  .prefix('/api')
