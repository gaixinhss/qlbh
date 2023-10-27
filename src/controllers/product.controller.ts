import express from 'express'

import { createProduct, deleteProduct, getAllProduct, getLastProduct, getProductByCode, updateHistoryPrice, updateProduct, findProduct, getHistoryPrice } from '../services/product.service';
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError';
import { generateCode } from '../utils/generateCode';

export const getProducts = async(req:express.Request,res:express.Response)=>{
    try{
        const lst = await getAllProduct();
        return res.status(200).json(lst);

    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Get the list of failed products");

    }
}
export const getProduct =async(req:express.Request,res:express.Response)=>{
    try{
        const {code} = req.params;
        const product = await getProductByCode(code);
        if(product){
            throw new ApiError(httpStatus.NOT_FOUND,"Product not found");
        }
        return res.status(200).json(product);
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Get product information failed");
    }
}
export const createPro = async(req:express.Request,res:express.Response)=>{
    try{
        const name = req.body.name;
        const sellingPrice= req.body.sellingPrice;
        const costPrice= req.body.costPrice;
        const inventory = req.body.inventory
        const unit = req.body.unit
       
        if(!name&&!sellingPrice&&!costPrice&&!inventory&&sellingPrice<0&&costPrice<0&&inventory<0){
            throw new ApiError(httpStatus.BAD_REQUEST,"Data cannot be left blank")
        }
        //lấy sản phẩm cuối
        const lastProduct =await getLastProduct();
        let nextCode:string ="SP1"//nếu không có sản phẩm
        if(lastProduct){
           const lastCode:string=lastProduct.code!;
            nextCode= generateCode(lastCode);
        }
        

        const productNew = await createProduct({
            code:nextCode,
            name,unit, sellingPrice,costPrice,inventory
        })
        res.status(httpStatus.CREATED).json({
            message:"Create product successful",
            data:productNew
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Created product error");
    }
}

export const updatePro = async(req:express.Request,res:express.Response)=>{
    try{
        const {code} = req.params;
        const body = req.body
        const sellingPrice:number= parseInt(req.body.sellingPrice);
        const product = await getProductByCode(code);
        if(sellingPrice<=0){
            throw new ApiError(httpStatus.BAD_REQUEST,"Selling price must be greater than 0")
        }
        if(!product){
            return res.status(httpStatus.NOT_FOUND).json({
                error:"product not found"
            })
        }
        
        
        if(sellingPrice!==product.sellingPrice){
            const newHistory ={
            date:new Date(),
            price:product.sellingPrice
            }
            const addHistory= await updateHistoryPrice(code,newHistory);
            
        }
      
        const updatePro= await updateProduct(code,body);
        return res.status(200).json({
            message:"update product successful",
            data:updatePro
        })

    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Updated product error");
    }
}
export const delPro = async(req:express.Request,res:express.Response)=>{
    try{
        const {code} = req.params;
        const delPro = await deleteProduct(code)
        if(!delPro){
            throw  new ApiError(httpStatus.BAD_REQUEST,"Product not found");
        }
        return res.status(httpStatus.OK).json({
            message:"delete product successful",
            data:delPro
        })

    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Delete product error");
    }
}
export const findPro = async(req:express.Request,res:express.Response)=>{
    try{
        const{code,name,sellingPrice, inventory}=req.query;
        const conditions:any={};
        if(code){
            conditions.code=code;
        }
        if(name){
            conditions.name=name;
        }
        if(sellingPrice){
            conditions.sellingPrice=sellingPrice
        }
        if(inventory){
            conditions.inventory=inventory
        }
        if(Object.keys(conditions).length <=0){
            throw new ApiError(httpStatus.BAD_REQUEST,"No data product available");
        }
        const  lstPro = await findProduct(conditions);
        return res.status(httpStatus.OK).json({
            message:"successful",
            data:lstPro
        })
    }   
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Find product information failed");
    }
}

export const getHistoryPro= async(req:express.Request,res:express.Response)=>{
    try{
        const {code} = req.params!;
        const history = await getHistoryPrice(code);
        return res.status(httpStatus.OK).json({data:history})
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Find history product failed")
    }
}
export const statisticsProduct=async (req:express.Request,res:express.Response)=>{
    try{
        const products = await getAllProduct();
        const inventoryList:{code:string,sellingPrice:number,inventory:number} []=[];
        let totalProduct:number=0;
        let totalPrice:number=0;
        products.forEach((product)=>{
            totalProduct += product.inventory!
            totalPrice += (product.inventory!* product.costPrice!)
            const code = product.code!;
            const sellingPrice= product.sellingPrice!
            const inventory = product.inventory!
            
            inventoryList.push({code,sellingPrice,inventory})
        })
        res.status(httpStatus.OK).json({
            data:inventoryList,
            totalProduct:totalProduct,
            totalPrice:totalPrice
        })

    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("Find statistics product failed")
    }
}