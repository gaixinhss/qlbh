import express from 'express'
import httpStatus from 'http-status'
import { createWareHouse, deleteWareHouse, findWareHouse, getAllWareHouses,getLastWareHouse, getWareHouseById } from '../services/warehouse.service'
import  ApiError  from '../utils/ApiError';
import { getProductByCode } from '../services/product.service';


export const getWareHouses= async(req:express.Request,res:express.Response)=>{
    try{
        const wareHouses = await getAllWareHouses();
        return res.status(httpStatus.OK).json({
            data:wareHouses
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error get all warehouse")
    }
}
export const getWareHouse = async(req:express.Request,res:express.Response)=>{
    try{
        const {id} = req.params;
        const wareHouse = await getWareHouseById(id);
        if(!wareHouse){
            throw new ApiError(httpStatus.NOT_FOUND,"warehouse not found");
        }
        return res.status(httpStatus.OK).json({
            data:wareHouse
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error get warehouse by code");
    }
}
export const createWare = async(req:express.Request,res:express.Response)=>{
    try{
        const location:string = req.body.location;
        const product :string= req.body.product;
        const existProduct = await getProductByCode(product);
        if(!existProduct){
            throw new ApiError(httpStatus.NOT_FOUND,"product not found");
        }
        if(!location || !product ){
            throw new ApiError(httpStatus.BAD_REQUEST,"data cannot be blank");
        }
        const newWareHouse=await createWareHouse({
            location,
            product
        })
       
        return res.status(httpStatus.CREATED).json({
            message:"Create warehouse successful",
            data:newWareHouse
        })
    }
    catch(error){

        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error created warehouse")
    }
}
export const delWareHouse= async(req:express.Request,res:express.Response)=>{
    try{
        const {id} = req.params;
        const wareHouse= await deleteWareHouse(id);
        if(!wareHouse){
            throw new ApiError(httpStatus.NOT_FOUND,"warehouse not found");
        }
        return res.status(httpStatus.OK).json({
            message :"deleted warehouse successful",
            data:wareHouse
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error deleted warehouse")
    }

}
export const findWere = async(req:express.Request,res:express.Response)=>{
    try{
        const {product, location} = req.query;
        const conditions :any={};
        if(product){
            conditions.product = product;
        }
        if(location){
            conditions.location=location;
        }
        if(Object.keys(conditions).length<=0){
            throw new ApiError(httpStatus.BAD_REQUEST,"No data warehouse available");
        }
        const wareHouses = await findWareHouse(conditions);
        if(!wareHouses){
            throw new ApiError(httpStatus.NOT_FOUND,"warehouse not found");
        }
        return res.status(httpStatus.OK).json({
            message:"successful",
            data:wareHouses
        })
        
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error find warehouse");
    }
}