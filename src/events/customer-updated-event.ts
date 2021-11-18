import { Topics } from "./topics"

export interface CustomerUpdatedEvent {
  topic: Topics.CustomerUpdated
  data: {
    id: string
    accountId: string
    customerId: any
    attributes: any
    cookies: string[]
    events: any
    demographic: any
    location: any
    brand: []
    product: []
    interest: []
    everyone: []
    everybuyer: []
  }
}