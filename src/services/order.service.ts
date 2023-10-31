import { Date } from 'mongoose'
import { orderModel } from '../models/order.model'

export const getAllOrder = () => orderModel.find()
export const getOrderByCode = (code: string) => orderModel.findOne({ code })
export const getLastOrder = () => orderModel.findOne({}, {}, { sort: { _id: -1 } })
//lấy ra số lượng từng sản phẩm mua theo code Order và code Product
export const getQuantity = (code: string, codeProduct: string) =>
  orderModel.aggregate([
    {
      $match: {
        code: code
      }
    },
    {
      $unwind: '$orderItem'
    },
    {
      $match: {
        'orderItem.product': codeProduct
      }
    },
    {
      $group: {
        _id: null,
        totalQuantity: {
          $sum: '$orderItem.quantity'
        }
      }
    }
  ])
//thống kê doanh thu theo sản phẩm
export const revenueByProduct = () =>
  orderModel.aggregate([
    {
      $unwind: '$orderItem'
    },
    {
      $group: {
        _id: '$orderItem.product',
        totalValue: { $sum: { $multiply: ['$orderItem.quantity', '$orderItem.price'] } }
      }
    }
  ])

// thống kê doanh thu theo khách hàng
export const revenueByCustomer = () =>
  orderModel.aggregate([
    {
      $group: {
        _id: '$customer',
        totalValue: { $sum: '$orderValue' }
      }
    }
  ])

export const createOrder = (values: Record<string, any>) =>
  new orderModel(values).save().then((order) => order.toObject())

export const updateOrder = (code: string, values: Record<string, any>) =>
  orderModel.findOneAndUpdate({ code }, values, { new: true })

export const deleteOrder = (code: string) => orderModel.findOneAndDelete({ code })

export const findOrder = (conditions: any) => orderModel.find(conditions)

export const replaceOrderItem = (code: string, orderItemNew: any) =>
  orderModel.updateOne({ code: code }, { $set: { orderItem: orderItemNew } })

export const getListOrderDate = (date: string) =>
  orderModel.find({
    orderDate: {
      $gte: new Date(date),
      $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
    }
  })
export const getOrderByMonth = (year: number, month: number) =>
  orderModel.find({
    orderDate: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1)
    }
  })
export const revenueOrder = (start: string, end: string) =>
  orderModel.aggregate([
    {
      $match: {
        orderDate: {
          $gte: new Date(start),
          $lte: new Date(end)
        }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$orderValue' }
      }
    }
  ])
