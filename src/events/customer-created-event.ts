import { Topics } from "./topics"

export interface CustomerCreatedEvent {
  topic: Topics.CustomerCreated
  data: {
    id: string
    accountId: string
    customerId: any
    attributes: any
    events: any
    cookies: string[]
    demographic: any
    location: any
    brand: []
    product: []
    interest: []
    everyone: []
    everybuyer: []
  }
}