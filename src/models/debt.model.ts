import mongoose from "mongoose";

const Schema = mongoose.Schema

const debtSchema = new Schema({
    code:{type:String,require:true},
    date:{type:Date,require:true},
    order:{type:String, ref:"Order", require:true},
    customer:{type:String,ref:"User",require:true},
    employee:{type:String, ref:"User",require:true},
    amountOwed:{type:Number, require:true, minValue:0}
},
{
  timestamps: true,
})
export const debtModel = mongoose.model("Debt",debtSchema)