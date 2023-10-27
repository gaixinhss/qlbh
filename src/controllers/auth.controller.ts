import express from 'express'
import { createUser, getLastUser, getLastUserByCode, getUserByEmail, getUserById } from '../services/user.service'
import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import dotenv from 'dotenv'
import ApiError from '../utils/ApiError'
import { generateCode } from '../utils/generateCode'
import { generateAccessToken, verifyToken } from '../middlewares/jwt'
import cookieParser = require('cookie-parser')
dotenv.config();

export const register = async(req:express.Request,res:express.Response)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const role:string = req.body.role;
        const phone=req.body.phone;
        const fullname = req.body.fullname;
        if(!username || !password || !email){//kiểm tra có trống dữ liệu
            throw new ApiError(httpStatus.BAD_REQUEST,"All input is required");
        }
        const userEmail = await getUserByEmail(email);
        if(userEmail){//kiểm tra user đã tồn tại chưa
            throw new ApiError(httpStatus.BAD_REQUEST,"Email already taken");
        }
        //mã hoá mật khẩu
        const salt = await bcrypt.genSalt(10);
        const encryptedPass:string = await bcrypt.hash(password,salt);
        //tạo code mới
        

        let nextCode:string ="";//nếu k có bản ghi
        if(role ==='employee'){
            nextCode="EM1";
            const user = await getLastUserByCode("EM");
           if(user){
            const lastCode = user.code!;
            nextCode =generateCode(lastCode);
            console.log(nextCode);
           }
        }
        if(role==="managerUser"){
            nextCode ="AD1"
            const user = await getLastUserByCode("AD");
           if(user){
            const lastCode = user.code!;
            nextCode =generateCode(lastCode);
            console.log(nextCode);
        }
    }
        if(role==="customer"|| !role){
            nextCode ="KH1"
            const user = await getLastUserByCode("AD");
           if(user){
            const lastCode = user.code!;
            nextCode =generateCode(lastCode);
            console.log(nextCode);
        }
    }
        console.log(nextCode);
        const userNew = await createUser({
            username,
            code:nextCode,
            password:encryptedPass,
            email,
            role,
            phone,
            fullname
          
        });
     return res.status(httpStatus.CREATED).json({
        message:"Sign up successful",
        data:userNew
     })

    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error register")
    }
}
export const login = async(req:express.Request,res:express.Response)=>{
    try{
        const email= req.body.email;
        const password = req.body.password;
        if(!email || !password){
            throw new ApiError(httpStatus.BAD_REQUEST,"All input is required");
        }
        const user= await getUserByEmail(email);
        if(!(user &&(await bcrypt.compare(password,user.password!)))){
            throw  new ApiError(httpStatus.NOT_FOUND,"User not found");
        }
        const token = generateAccessToken({_id:user._id});
        res.cookie("token",token ,{httpOnly:true,maxAge:3*60*60*1000})
        return res.status(httpStatus.OK).json({
            message:"Login successful",
            data : user
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error login")
    }
}
export const logout = async(req:express.Request,res:express.Response)=>{
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
       res.clearCookie('token',{
        httpOnly:true,
        secure:true
       })
        return res.status(httpStatus.OK).json({
            message:"logout successful",
            data:user
        })
    }
    catch(error){
        console.log(error);
        return res.status(httpStatus.BAD_REQUEST).json("error logout")
    }
}