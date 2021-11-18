import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  user_id: number,
  acc_id: number,
  email: string,
  exp: number
}

interface CurrentUser {
  id: number,
  accountId: number,
  email: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers?.authorization) {
    return next()
  }

  // verify token inside cookie
  // if (!req.session?.jwt) {
  //   return next()
  // }

  try {
    const payload = jwt.verify(
      req.headers.authorization.slice(4),
      process.env.JWT_KEY!
    ) as UserPayload

    req.currentUser = {
      id: payload.user_id,
      accountId: payload.acc_id,
      email: payload.email,
    }
  } catch (err) { }

  next()
}