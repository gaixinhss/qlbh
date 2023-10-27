import express from 'express'
import { addPromotion, deletePromo ,findPromo} from '../controllers/promotion.controller'
import { checkEmployee,checkCustomer } from '../middlewares/checkRole';


export default (router:express.Router)=>{
    router.put('/promotion/add/:code',checkEmployee,addPromotion);
    router.put('/promotion/remove/:code',checkEmployee,deletePromo);

    router.get('/promotion/tim-kiem/:code',checkCustomer,findPromo);
}