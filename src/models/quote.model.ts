import mongoose from 'mongoose'

const Schema = mongoose.Schema

const quoteSchema = new Schema(
  {
    code: { type: String, require: true, unique: true },
    customer: { type: String, require: true, ref: 'User' },
    employee: { type: String, require: true, ref: 'User' },
    date: { type: Date, require: true },
    products: [
      {
        productCode: { type: String, require: true, ref: 'Product' },
        quantity: { type: Number, require: true, min: 0 },
        discount: { type: Number, require: true, min: 0 },
        price: { type: Number, require: true, min: 0 }
      }
    ],
    totalAmount: { type: Number, require: true },
    discountTotal: { type: Number, require: true, min: 0 },
    description: { type: String, default: 'Sales' }
  },
  {
    timestamps: true
  }
)
export const quoteModel = mongoose.model('Quote', quoteSchema)
