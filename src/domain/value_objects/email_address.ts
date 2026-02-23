export class EmailAddress {
  static normalize(email: string): string {
    return email.toLowerCase().trim()
  }
}
