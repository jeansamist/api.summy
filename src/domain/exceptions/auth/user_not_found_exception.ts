import { DomainException } from '#domain/exceptions/domain_exception'
import { DomainErrorCode } from '#shared/enums/domain_error_code'

export class UserNotFoundException extends DomainException {
  constructor() {
    super('User does not exist', DomainErrorCode.UserNotFound, 404)
    this.name = 'UserNotFoundException'
  }
}
