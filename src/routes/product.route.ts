import express from 'express'

import {
  createPro,
  delPro,
  findPro,
  getHistoryPro,
  getProduct,
  getProducts,
  statisticsProduct,
  updatePro
} from '../controllers/product.controller'
import { checkUnit, checkPrice } from '../middlewares/checkData'
import { checkCustomer, checkEmployee, checkManager } from '../middlewares/checkRole'

export default (router: express.Router) => {
  router.get('/pro/danh-sach-san-pham', checkCustomer, getProducts)
  router.get('/pro/code/:code', checkCustomer, getProduct)

  router.post('/pro', checkEmployee, checkPrice, checkUnit, createPro)

  router.put('/pro/:code', checkEmployee, updatePro)

  router.delete('/pro/:code', checkManager, delPro)

  router.get('/pro/tim-kiem-san-pham', checkCustomer, findPro)

  router.get('/pro/lich-su-san-pham/:code', checkManager, getHistoryPro)

  router.get('/pro/thong-ke', checkManager, statisticsProduct)
}
