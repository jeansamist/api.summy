export class QueueJobFailedException extends Error {
  constructor(
    public readonly jobName: string,
    public readonly attempts: number,
    public readonly originalError: unknown
  ) {
    super(`Queue job \"${jobName}\" failed after ${attempts} attempts`)
    this.name = 'QueueJobFailedException'
  }
}
