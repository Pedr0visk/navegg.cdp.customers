import express, { Request, Response } from 'express'
import { currentUser } from '../middlewares/current-user'
import { requireAuth } from '../middlewares/require-auth'
import { Customer } from '../models/customers'

const router = express.Router()

router.get('/api/customers/_search', currentUser, requireAuth, async (req: Request, res: Response) => {
  const customers = await Customer.find({
    accountId: req.currentUser!.accountId,
    $and: [
      { 'events.uid': { $in: ['USER_FILLED_FORM'] } },
      {
        $or: [
          { 'attributes.email': 'ext.pedro.santos@navegg.com' },
          { 'brand.cid': { $all: [42, 1092] } },
        ]
      }
    ],
  })

  res.send({
    results: customers.length,
    data: customers
  })
})

export { router as indexCustomersRouter }
