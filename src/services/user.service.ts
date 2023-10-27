import {userModel} from '../models/user.model'

export const getAllUser=()=>userModel.find();
export const getUserByCode=(code:string)=>userModel.findOne({code});
export const getLastUser =()=>userModel.findOne({},{},{sort:{_id:-1}});
export const getUserByEmail =(email:string)=>userModel.findOne({email:email});
export const getUserById=(id:string)=>userModel.findById(id);

export const updateUserByCode =(code:string, value:Record<string,any>)=>userModel.findOneAndUpdate({code},value,{new:true});
export const createUser =(values:Record<string, any>)=> new userModel(values).save().then((user)=>user.toObject());
export const findUser=(conditions:any)=>userModel.find(conditions);
export const delUserByCode=(code:string)=> userModel.findOneAndDelete({code:code});

export const getLastUserByCode=(code:string)=>userModel.findOne({code: new RegExp(`^${code}\\d+`)}).sort({ createdAt: -1 }).limit(1)

export const getLoyalByCode=(code:string)=>userModel.findOne({code},{_id:false,username:true,loyal:true});