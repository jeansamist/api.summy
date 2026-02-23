import { DomainErrorCode } from '#shared/enums/domain_error_code'

export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: DomainErrorCode,
    public readonly status: number = 400
  ) {
    super(message)
    this.name = 'DomainException'
  }
}
