import { DomainException } from '#domain/exceptions/domain_exception'
import { DomainErrorCode } from '#shared/enums/domain_error_code'

export class EmailNotVerifiedException extends DomainException {
  constructor() {
    super(
      'Please verify your email address before signing in. Check your email for the verification code.',
      DomainErrorCode.EmailNotVerified,
      403
    )
    this.name = 'EmailNotVerifiedException'
  }
}
