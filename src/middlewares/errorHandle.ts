import { Request, Response, NextFunction } from 'express'
import ApiError from '../utils/ApiError'

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'
  const isOperational = err instanceof ApiError && err.isOperational

  res.status(statusCode).json({ message, isOperational })

  if (!isOperational) {
    console.error(err)
  }
  next()
}

export default errorHandler
