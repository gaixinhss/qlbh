import express from "express"

import { findDeb, getDebt, getDebts } from '../controllers/debt.controller'
import { checkEmployee } from '../middlewares/checkRole';

export default (router:express.Router)=>{
    router.get('/debts',checkEmployee,getDebts);
    router.get('/debt/tim-kiem-cong-no',checkEmployee,findDeb)
    router.get('/debt/:code',checkEmployee,getDebt)
   

}