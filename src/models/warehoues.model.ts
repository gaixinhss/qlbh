import mongoose from "mongoose";

const Schema = mongoose.Schema;

const wareHouseSchema = new Schema({
    location:{type:String, require:true},
    product :{type:String,require:true,ref:"Product"}
},
{
  timestamps: true,
})
export const wareHouseModel = mongoose.model("Warehouse",wareHouseSchema);