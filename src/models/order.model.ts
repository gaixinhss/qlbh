/**
 * table đơn hàng(order)
 */
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const orderSchema = new Schema(
  {
    code: { type: String, require: true, unique: true },
    orderDate: { type: String, require: true },
    customer: { type: String, ref: 'User', require: true },
    employee: { type: String, ref: 'User', require: true },
    orderItem: [
      {
        product: { type: String, ref: 'Product', require: true },
        quantity: { type: Number, require: true, min: 0 },
        price: { type: Number, require: true, min: 0 }
      }
    ],
    transactionType: { type: String, enum: ['sell', 'buy'], default: 'sell', require: true },
    orderValue: { type: Number, require: true, min: 0 },
    status: { type: Boolean, default: true, require: true }
  },
  {
    timestamps: true
  }
)
export const orderModel = mongoose.model('Order', orderSchema)
