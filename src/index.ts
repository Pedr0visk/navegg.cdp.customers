import mongoose from 'mongoose'
import { app } from './app'
import { kafkaWrapper } from './kafka-wrapper'
import { CustomerCreatedConsumer } from './events/consumers/customer-created-consumer'
import { CustomerUpdatedConsumer } from './events/consumers/customer-updated-consumer'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  if (!process.env.KAFKA_BROKERS) {
    throw new Error('KAFKA_BROKERS must be defined')
  }

  try {
    await kafkaWrapper.connect('customers-kafka', process.env.KAFKA_BROKERS.split(','))
    new CustomerCreatedConsumer(kafkaWrapper.client).listen()
    new CustomerUpdatedConsumer(kafkaWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected to MongoDb')
  } catch (err) {
    console.log(err)
  }

  app.listen(4278, () => {
    console.log('Listening on port 4278!')
  })
}

start()
