import mongoose, { Schema } from "mongoose"
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface EventAttrs {
  uid: string
  name?: string
  description?: string
}

interface CustomerAttrs {
  id: string
  customerId: any
  accountId: number
  attributes: any
  cookies?: string[]
  events?: EventAttrs[]
  demographic: any
  location: any
  brand?: any[]
  product?: any[]
  interest?: any[]
  everyone?: any[]
  everybuyer?: any[]
  version: number
}

interface CustomerDoc extends mongoose.Document {
  customerId: any
  accountId: number
  attributes: any
  cookies?: string[]
  events: EventAttrs[]
  demographic: any
  location: any
  brand?: any[]
  product?: any[]
  interest?: any[]
  everyone?: any[]
  everybuyer?: any[]
  version: number
}

interface CustomerModel extends mongoose.Model<CustomerDoc> {
  build(attrs: CustomerAttrs): CustomerDoc
  findByEvent(event: {
    id: string
    accountId: string
    // version: number;
  }): Promise<CustomerDoc | null>
}

const customerSchema = new Schema(
  {
    customerId: {
      type: Object,
      required: true,
    },
    accountId: {
      type: Number,
      required: true,
    },
    attributes: {
      type: Object,
      required: true,
    },
    events: {
      type: Array,
      required: false,
    },
    cookies: {
      type: Array,
      required: false,
    },
    brand: {
      type: Array,
      required: false
    },
    product: {
      type: Array,
      required: false
    },
    interest: {
      type: Array,
      required: false
    },
    everyone: {
      type: Array,
      required: false
    },
    everybuyer: {
      type: Array,
      required: false
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
)

customerSchema.set('versionKey', 'version')
customerSchema.set('timestamps', true)
customerSchema.plugin(updateIfCurrentPlugin)

customerSchema.statics.findByEvent = (event: { id: string; accountId: number }) => {
  return Customer.findOne({
    _id: event.id,
    accountId: event.accountId
    // version: event.version - 1,
  });
};

customerSchema.statics.build = (attrs: CustomerAttrs) => {
  return new Customer({
    _id: attrs.id,
    customerId: attrs.customerId,
    accountId: attrs.accountId,
    cookies: attrs.cookies,
    attributes: attrs.attributes,
    events: attrs.events,
    demographic: attrs.demographic,
    location: attrs.location,
    brand: attrs.brand,
    product: attrs.product,
    everybuyer: attrs.everybuyer,
    everyone: attrs.everyone,
    interest: attrs.interest,
  })
}

const Customer = mongoose.model<CustomerDoc, CustomerModel>('Customer', customerSchema)

export { Customer }