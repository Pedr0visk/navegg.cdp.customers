import { Message } from "kafkajs"
import { Consumer } from "../base-consumer"
import { CustomerUpdatedEvent } from "../customer-updated-event"
import { Topics } from "../topics"
import { queueGroupName } from "../kafka-group-name"
import { Customer } from "../../models/customers"

export class CustomerUpdatedConsumer extends Consumer<CustomerUpdatedEvent> {
  topic: Topics.CustomerUpdated = Topics.CustomerUpdated
  queueGroupName = queueGroupName

  async onMessage(data: CustomerUpdatedEvent['data'], msg: Message) {
    const customer = await Customer.findByEvent(data)

    if (!customer) {
      // if customer does not exists
      // create one
      const { id, accountId, customerId, attributes, cookies, events } = data

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
      return
    }

    const {
      cookies,
      events,
      attributes,
      brand,
      demographic,
      location,
      interest,
      everyone,
      everybuyer,
      product
    } = data

    customer.set({
      cookies,
      events,
      attributes,
      demographic,
      location,
      brand,
      product,
      interest,
      everyone,
      everybuyer
    })
    await customer.save()
    console.log('successfully updated!')
  }
}