import { Kafka, Message } from "kafkajs";
import { Topics } from "./topics";

console.clear()

interface Event {
  topic: Topics;
  data: any;
}

export abstract class Consumer<T extends Event> {
  abstract topic: T['topic']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: any): void
  protected client: Kafka

  errorTypes = ['unhandledRejection', 'uncaughtException', 'KafkaJSNonRetriableError']
  signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

  constructor(client: Kafka) {
    this.client = client
  }

  async listen() {
    const consumer = this.client.consumer({ groupId: `${this.queueGroupName}-topic-${this.topic}` })

    const run = async () => {
      await consumer.connect()
      await consumer.subscribe({ topic: this.topic, fromBeginning: true })
      await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
          // console.log(`- ${prefix} ${message.key}#${message.value}`)

          const parseData = this.parseMessage(message)

          this.onMessage(parseData, message)
        },
      })
    }

    run().catch(e => console.error(`@@@ [example/consumer] ${e.message}`, e))

    //  Error Handlers
    this.errorTypes.map(type => {
      process.on(type, async e => {
        console.log('@@@ errorTypes')
        try {
          console.log(`process.on ${type}`)
          console.error(e)
          await consumer.disconnect()
          process.exit(0)
        } catch (_) {
          process.exit(1)
        }
      })
    })

    this.signalTraps.map(type => {
      process.once(type, async () => {
        try {
          await consumer.disconnect()
        } finally {
          process.kill(process.pid, type)
        }
      })
    })
  }

  parseMessage(msg: Message) {
    const data = msg.value
    if (data)
      return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf8'))
  }
}

