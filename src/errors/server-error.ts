import { CustomError } from './custom-error';

export class ServerError extends CustomError {
  statusCode = 500

  constructor() {
    super('Route not found')

    Object.setPrototypeOf(this, ServerError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Internal error' }]
  }
}
