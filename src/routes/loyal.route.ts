import express from 'express'
import { editLoyal, getLoyal } from '../controllers/loyal.controller'
import { checkEmployee, checkCustomer, checkManager } from '../middlewares/checkRole'

export default (router: express.Router) => {
  router.get('/loyal/:code', checkCustomer, getLoyal)
  router.put('/loyal/:code', checkManager, editLoyal)
}
