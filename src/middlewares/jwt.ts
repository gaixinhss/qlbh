import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const tokenKey = process.env.JWT_SECRET!;
export const generateAccessToken = (obj:any)=>{
    return  jwt.sign(obj,tokenKey,{
        expiresIn:'3h'
    });
}

export const verifyToken=(token:string)=>{
    return jwt.verify(token,tokenKey);
}