import express from 'express'
import { getQuote, getQuotes,createQuo, findQuo, editQuote, delQuote } from '../controllers/quote.controller'
import { checkEmployee, checkManager } from '../middlewares/checkRole';

export default (router:express.Router)=>{
    router.get('/quotes',checkManager,getQuotes)
    router.get('/quote/tim-kiem-bao-gia',checkEmployee,findQuo);
    router.get('/quote/:code',checkEmployee,getQuote)

    router.post('/quote',checkEmployee,createQuo);
    router.put('/quote/:code',checkEmployee,editQuote)
    router.delete('/quote/:code',checkManager,delQuote);
}