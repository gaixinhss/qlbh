import express from 'express'
import httpStatus from 'http-status'
import { generateCode } from '../utils/generateCode'
import ApiError  from '../utils/ApiError'
import { findDebt, getAllDebt, getDebtByCode } from '../services/debt.service'
import { getUserByCode } from '../services/user.service'

export const getDebts=async(req:express.Request,res:express.Response)=>{
    try{
        const debts = await getAllDebt();
        return res.status(httpStatus.OK).json({
            data:debts
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error get debts")
    }
}
export const getDebt = async(req:express.Request,res:express.Response)=>{
    try{
        const {code}= req.params;
        const debt = await getDebtByCode(code);
        return res.status(httpStatus.OK).json({
            data:debt
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.OK).json("error get debt by code")
    }
}

export const findDeb = async(req:express.Request, res:express.Response)=>{
    try{
        const {code,customer, employee}= req.query;
        const conditions:any={};
        if(code){
            conditions.code = code;
        }
        if(customer){
            conditions.customer = customer;
        }
        if(employee){
            conditions.employee=employee;
        }
        if(Object.keys(conditions).length<=0){
            throw new ApiError(httpStatus.BAD_REQUEST,"no data search available");
        }
        const debts = await findDebt(conditions);
        return res.status(httpStatus.OK).json({
            message:"successful",
            data : debts
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error find debt")
    }
}