import express from 'express'
import httpStatus from 'http-status';

const validUnit:string[]=['pcs','kg','box']

export function checkUnit(req:express.Request,res:express.Response,next:express.NextFunction){
    const unit = req.body.unit
    if(validUnit.includes(unit)){
        next();
    }
    else{
        res.status(httpStatus.BAD_REQUEST).json({
            error:"Invalid unit product"
        })
    }
}
export function checkPrice(req:express.Request,res:express.Response,next:express.NextFunction){
    const sellingPrice = req.body.sellingPrice;
    const costPrice= req.body.costPrice
    const inventory = req.body.inventory
    if(sellingPrice>0&&costPrice>0&&inventory>0){
        next();
    }
    else{
        res.status(httpStatus.BAD_REQUEST).json({
            error:"value needs to be greater than 0"
        })
    }
}
const validTransactionType:string[]=['sell','buy'];
export function checkTransaction(req:express.Request,res:express.Response,next:express.NextFunction){
    const type:string = req.body.transactionType;
   
    if(validTransactionType.includes(type)||(!type)){
        next();
    }
    else{
        res.status(httpStatus.BAD_REQUEST).json({
            error:"Invalid type order transaction"
        })
    }

}