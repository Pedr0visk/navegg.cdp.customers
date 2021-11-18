import { Message } from "kafkajs"
import { Consumer } from "../base-consumer"
import { CustomerCreatedEvent } from "../customer-created-event"
import { Topics } from "../topics"
import { Customer } from "../../models/customers"
import { queueGroupName } from "../kafka-group-name"

export class CustomerCreatedConsumer extends Consumer<CustomerCreatedEvent> {
  topic: Topics.CustomerCreated = Topics.CustomerCreated
  queueGroupName = queueGroupName

  async onMessage(data: CustomerCreatedEvent['data'], msg: Message) {
    const {
      id,
      accountId,
      customerId,
      attributes,
      cookies,
      events
    } = data

    const customer = Customer.build({
      id,
      accountId: +accountId,
      customerId,
      attributes,
      cookies,
      events,
      demographic: {},
      location: {},
      brand: [],
      product: [],
      interest: [],
      everyone: [],
      everybuyer: [],
      version: 0
    })
    await customer.save()
    console.log('successfully created!')
  }
}