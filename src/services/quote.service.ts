import { quoteModel } from "../models/quote.model";

export const getAllQuote =()=>quoteModel.find();
export const findQuote=(conditions:any)=>quoteModel.find(conditions);
export const getQuoteByCode=(code:string) =>quoteModel.findOne({code});
export const createQuote =(values:Record<string,any>)=>new quoteModel(values).save().then((quote)=>quote.toObject());

export const deleteQuote =(code:string)=>quoteModel.findOneAndDelete({code});

export const getLastQuote =()=>quoteModel.findOne({},{},{sort:{_id:-1}});

export const updateQuote=(code:string,value:Record<string,any>)=>quoteModel.findOneAndUpdate({code},value,{new:true});