import express from 'express'

import {
  createOrd,
  getOrder,
  getOrders,
  delOrder,
  revenueCustomer,
  revenueProduct,
  editOrderItem,
  revenueOrdersByDate,
  revenueOrderByMonth,
  revenueOrderByYear
} from '../controllers/order.controller'
import { checkDate, checkDay, checkTransaction } from '../middlewares/checkData'
import { checkCustomer, checkEmployee, checkManager } from '../middlewares/checkRole'

export default (router: express.Router) => {
  router.get('/order/revenue/date/:date', revenueOrdersByDate)
  router.get('/order/revenue/month', checkDay, revenueOrderByMonth)
  router.get('/order/revenue/year', checkDate, revenueOrderByYear)
  router.get('/orders', checkManager, getOrders)

  router.get('/order/:code', checkEmployee, getOrder)
  router.get('/order/revenue/customer', checkManager, revenueCustomer)
  router.get('/order/revenue/product', checkManager, revenueProduct)

  router.post('/order', checkEmployee, checkTransaction, createOrd)
  router.delete('/order/:code', checkManager, delOrder)
  router.put('/order/:code', checkCustomer, editOrderItem)
}
