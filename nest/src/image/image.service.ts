import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq'
import { QueueName } from 'src/constants/queues'

@Injectable()
export class ImageService {
  constructor(@InjectQueue(QueueName.IMAGE) private imageQueue: Queue) {}
}
