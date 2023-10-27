import express from 'express'

import { createOrd, getOrder, getOrders,delOrder, revenueCustomer, revenueProduct, editOrderItem } from '../controllers/order.controller'
import { checkTransaction } from '../middlewares/checkData';
import { checkCustomer, checkEmployee, checkManager } from '../middlewares/checkRole';


export default (router:express.Router)=>{
    router.get('/orders',checkManager,getOrders);
    router.get('/order/:code',checkEmployee,getOrder);
    router.get('/order/revenue/customer',checkManager,revenueCustomer);
    router.get('/order/revenue/product',checkManager,revenueProduct)

    router.post('/order',checkEmployee,checkTransaction,createOrd)
    router.delete('/order/:code',checkManager,delOrder)
    router.put('/order/:code',checkCustomer,editOrderItem)
}