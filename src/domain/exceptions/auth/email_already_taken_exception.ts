import { DomainException } from '#domain/exceptions/domain_exception'
import { DomainErrorCode } from '#shared/enums/domain_error_code'

export class EmailAlreadyTakenException extends DomainException {
  constructor() {
    super('Email has already been taken', DomainErrorCode.EmailAlreadyTaken, 409)
    this.name = 'EmailAlreadyTakenException'
  }
}
