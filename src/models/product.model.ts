import mongoose, { Mongoose, mongo } from 'mongoose'
const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    code: {
      //duy nhất, SP***
      type: String,
      require: true,
      unique: true
    },
    name: { type: String, require: true },
    unit: { type: String, enum: ['pcs', 'kg', 'box'], require: true }, //đơn vị tính
    sellingPrice: { type: Number, require: true, min: 0 }, // >0
    costPrice: { type: Number, require: true, min: 0 },
    inventory: { type: Number, require: true, min: 0 },
    priceHistory: [
      {
        //lịch sử giá hàng hoá
        date: { type: Date, require: true },
        price: { type: Number, require: true, min: 0 }
      }
    ],
    promotion: {
      promotionName: { type: String, require: true },
      start: { type: Date, require: true },
      end: { type: Date, require: true },
      type: { type: String, require: true },
      details: { type: String, require: true },
      discountRate: { type: Number, require: true }
    }
  },
  {
    timestamps: true
  }
)
export const productModel = mongoose.model('Product', productSchema)
