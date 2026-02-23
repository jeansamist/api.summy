export type QueueOrder = 'fifo' | 'lifo' | 'lilo'

export interface QueueRetryOptions {
  retries?: number
  retryDelayMs?: number
}

export interface QueueJobOptions extends QueueRetryOptions {
  jobName?: string
  order?: QueueOrder
}

export type QueueTask = () => void | Promise<void>

export abstract class QueueManagerContract {
  abstract addQueueJob(queueName: string, handler: QueueTask, options?: QueueJobOptions): void
}
