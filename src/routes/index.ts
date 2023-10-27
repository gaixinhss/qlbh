import express from 'express'
import authRoute from './auth.route'
import userRoute from './user.route';
import productRoute from './product.route';
import orderRoute from './order.route';
import debtRoute from './debt.route';
import promotionRoute from './promotion.route';
import loyalRoute from './loyal.route';
import warehouseRoute from './warehouse.route';
import quoteRoute from './quote.route';
import { checkLogin } from '../middlewares/checkRole';

const router = express.Router();


export default():express.Router=>{
    authRoute(router);
    router.use(checkLogin)
    userRoute(router);
    productRoute(router);
    orderRoute(router);
    debtRoute(router);
    promotionRoute(router);
    loyalRoute(router);
    warehouseRoute(router);
    quoteRoute(router);
    return router;
}