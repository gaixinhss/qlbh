import express from 'express'
import { verifyToken } from './jwt'
import { getUserById } from '../services/user.service';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

export const checkLogin =async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
        const token:string = req.cookies['token'];
        if(!token){
            throw new ApiError(httpStatus.NOT_FOUND,"token not found")
        }
        const id:string = await verifyToken(token) as string;
       const user = await getUserById(id);
       if(!user){
        throw new ApiError(httpStatus.NOT_FOUND,"user not found");
       }
       next();
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("you need to login")
    }
}
export const checkCustomer = async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try {
        const token: string = req.cookies['token'];
        if (!token) {
          throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
        }
        const id: string = await verifyToken(token) as string;
        const user = await getUserById(id);
        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }
        const role: string = user.role;

        if (role === 'customer' || role === 'employee' || role === 'managerUser') {

          next();
        } else {
          return res.status(httpStatus.FORBIDDEN).json("You do not have permission");
        }
      } catch (error) {
        console.log(error);
        return res.status(httpStatus.FORBIDDEN).json("You do not have permission");
      }
}
export const checkEmployee = async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try {
        const token: string = req.cookies['token'];
        if (!token) {
          throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
        }
        const id: string = await verifyToken(token) as string;
        const user = await getUserById(id);
        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }
        const role: string = user.role;
        if (role === 'employee' || role === 'managerUser') {
          next();
        } else {
          return res.status(httpStatus.FORBIDDEN).json("You do not have permission");
        }
      } catch (error) {
        console.log(error);
        return res.status(httpStatus.FORBIDDEN).json("You do not have permission");
      }
}

export const checkManager = async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try {
        const token: string = req.cookies['token'];
        if (!token) {
          throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
        }
        const id: string = await verifyToken(token) as string;
        const user = await getUserById(id);
        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }
        const role: string = user.role;
        if (role === 'managerUser') {
          next();
        } else {
          return res.status(httpStatus.FORBIDDEN).json("You do not have permission");
        }
      } catch (error) {
        console.log(error);
        return res.status(httpStatus.FORBIDDEN).json("You do not have permission");
      }
}