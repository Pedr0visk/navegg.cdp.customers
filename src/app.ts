import express from 'express'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { currentUser } from './middlewares/current-user'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

import { indexCustomersRouter } from './routes'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)

app.use(indexCustomersRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

app.use(errorHandler)

export { app }