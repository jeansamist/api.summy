import { Queue, Worker, type Processor, type QueueOptions, type WorkerOptions } from 'bullmq'

type QueueJobData = Record<string, unknown>
type QueueAddArgs<DataType extends QueueJobData, ResultType, NameType extends string> = Parameters<
  Queue<DataType, ResultType, NameType>['add']
>

export class QueueManager<
  DataType extends QueueJobData = QueueJobData,
  ResultType = unknown,
  NameType extends string = string,
> {
  private readonly queues = new Map<string, Queue<DataType, ResultType, NameType>>()

  getQueue(name: string, opts?: QueueOptions): Queue<DataType, ResultType, NameType> {
    if (!this.queues.has(name)) {
      const queue = new Queue<DataType, ResultType, NameType>(name, opts)
      this.queues.set(name, queue)
    }

    return this.queues.get(name)!
  }

  async addJob(
    queueName: string,
    jobName: QueueAddArgs<DataType, ResultType, NameType>[0],
    data: QueueAddArgs<DataType, ResultType, NameType>[1],
    opts?: QueueAddArgs<DataType, ResultType, NameType>[2]
  ) {
    const queue = this.getQueue(queueName)
    return queue.add(jobName, data, opts)
  }

  createWorker(
    queueName: string,
    processor: Processor<DataType, ResultType, NameType>,
    opts?: WorkerOptions
  ): Worker<DataType, ResultType, NameType> {
    return new Worker<DataType, ResultType, NameType>(queueName, processor, opts)
  }
}

export const queueManager = new QueueManager()
