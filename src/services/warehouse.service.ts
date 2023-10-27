import { wareHouseModel } from "../models/warehoues.model";

export const getAllWareHouses=()=>wareHouseModel.find();
export const getWareHouseById=(id:string)=>wareHouseModel.findById(id);

export const findWareHouse=(conditions:any)=>wareHouseModel.find(conditions);

export const createWareHouse=(value:Record<string,any>)=>new wareHouseModel(value).save().then((warehouse)=>warehouse.toObject());

export const deleteWareHouse=(id:string)=>wareHouseModel.findByIdAndDelete({_id:id})

export const getLastWareHouse=()=>wareHouseModel.findOne({},{},{sort:{_id:-1}});