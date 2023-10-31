import express from 'express'
import httpStatus from 'http-status'
import { Response } from 'express'
import { isValidDateFormat } from '../utils/checkFormatDate'

const validUnit: string[] = ['pcs', 'kg', 'box']

export function checkUnit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const unit = req.body.unit
  if (validUnit.includes(unit)) {
    next()
  } else {
    res.status(httpStatus.BAD_REQUEST).json({
      error: 'Invalid unit product'
    })
  }
}
export function checkPrice(req: express.Request, res: express.Response, next: express.NextFunction) {
  const sellingPrice = req.body.sellingPrice
  const costPrice = req.body.costPrice
  const inventory = req.body.inventory
  if (sellingPrice > 0 && costPrice > 0 && inventory > 0) {
    next()
  } else {
    res.status(httpStatus.BAD_REQUEST).json({
      error: 'value needs to be greater than 0'
    })
  }
}
const validTransactionType: string[] = ['sell', 'buy']
export function checkTransaction(req: express.Request, res: express.Response, next: express.NextFunction) {
  const type: string = req.body.transactionType

  if (validTransactionType.includes(type) || !type) {
    next()
  } else {
    res.status(httpStatus.BAD_REQUEST).json({
      error: 'Invalid type order transaction'
    })
  }
}
export function checkDay(req: express.Request, res: express.Response, next: express.NextFunction) {
  const year: number = parseInt(req.query.year as string)
  const month: number = parseInt(req.query.month as string)
  if (!year || !month || month < 0 || month > 12 || year < 2000) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'Invalid year,month order'
    })
  }
  next()
}
export function checkDate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const start: string = req.query.start as string
  const end: string = req.query.end as string
  if (!start || !end || !isValidDateFormat(start) || !isValidDateFormat(end)) {
    return res.status(httpStatus.BAD_REQUEST).json('error format date')
  }
  next()
}
