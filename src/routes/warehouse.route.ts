import express from 'express'
import { createWare, getWareHouse, getWareHouses, delWareHouse, findWere } from '../controllers/warehouse.controller'
import { checkEmployee, checkManager } from '../middlewares/checkRole'
export default (router: express.Router) => {
  router.get('/warehouses', checkManager, getWareHouses)
  router.get('/warehouse/tim-kiem-kho-hang', checkEmployee, findWere)
  router.get('/warehouse/:id', checkEmployee, getWareHouse)
  router.post('/warehouse', checkManager, createWare)

  router.delete('/warehouse/:id', checkManager, delWareHouse)
}
