import express from 'express'
import {
  createOrder,
  deleteOrder,
  getAllOrder,
  getLastOrder,
  getListOrderDate,
  getOrderByCode,
  getOrderByMonth,
  revenueByCustomer,
  revenueOrder,
  updateOrder
} from '../services/order.service'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'
import { getUserByCode, updateUserByCode } from '../services/user.service'
import { getProductByCode, updateProduct } from '../services/product.service'
import { generateCode } from '../utils/generateCode'
import { createDebt, getLastDebt } from '../services/debt.service'
import { Date } from 'mongoose'
import { revenueByProduct } from '../services/order.service'

export const getOrders = async (req: express.Request, res: express.Response) => {
  try {
    const orders = await getAllOrder()
    return res.status(httpStatus.OK).json({
      data: orders
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get users')
  }
}
export const getOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const order = await getOrderByCode(code)
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found')
    }
    return res.status(httpStatus.OK).json({
      data: order
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get order')
  }
}
export const createOrd = async (req: express.Request, res: express.Response) => {
  try {
    const customer: string = req.body.customer //lấy code khách hàng
    const employee: string = req.body.employee //lấy code nhân viên
    const transactionType: string = req.body.transaction //lấy loại giao dịch
    //lấy danh sách sản phẩm
    const orderItem: { product: string; quantity: number; price: number }[] = req.body.orderItem
    const status: boolean = req.body.status
    if (!customer && !orderItem && !employee) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Data cannot be left blank')
    }
    //kiểm tra khách hàng có tồn tại không
    const existCus = await getUserByCode(customer)
    if (!existCus) {
      throw new ApiError(httpStatus.NOT_FOUND, 'customer not found')
    }
    const existEmp = await getUserByCode(employee)
    if (!existEmp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'employee not found')
    }
    let total: number = 0 //tổng giá trị đơn hàng
    orderItem.forEach(async (item) => {
      //duyệt từng sản phẩm trong order item
      const productCode: string = item.product
      const product = await getProductByCode(productCode) //lấy thông tin product
      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found' + productCode)
      }
      const inventory: number = product?.inventory! //số lượng tồn kho

      if (inventory < item.quantity) {
        //kiểm tra số lượng mua
        throw new ApiError(httpStatus.BAD_REQUEST, 'too many products ' + product?.name)
      }
      item.price = product?.sellingPrice! //lấy giá bán hiện tại

      total += item.quantity * item.price //tính tổng tiền

      //update số lượng sản phẩm
      const body: any = { inventory: inventory - item.quantity }
      await updateProduct(productCode, body)
    })

    const lastOrder = await getLastOrder()
    let nextCode: string = 'DH1'
    if (lastOrder) {
      const lastCode = lastOrder.code!
      nextCode = generateCode(lastCode)
    }
    //nếu status == false (chưa thanh toán) thêm vào bảng công nợ Debt
    if (!status) {
      const lastDebt = await getLastDebt()
      let codeDebt: string = 'DE1'
      if (lastDebt) {
        const lastDebtCode = lastDebt.code!
        codeDebt = generateCode(lastDebtCode)
      }
      ///thêm debt mới
      const debtNew = await createDebt({
        code: codeDebt,
        date: new Date(),
        customer,
        employee,
        order: nextCode,
        amountOwed: total
      })
    }
    //nếu status == true ( đã thanh toán) thì thêm vào loyal
    if (status) {
      const currentLoyalCus = existCus.loyal
      const currentLoyalEmp = existEmp.loyal
      const loyalPoints: number = total * 0.001
      const currentPointCus: number = currentLoyalCus?.pointLoyal || 0
      const currentPointEmp: number = currentLoyalEmp?.pointLoyal || 0
      const updatePointCus: number = currentPointCus + loyalPoints
      const updatePointEmp: number = currentPointEmp + loyalPoints
      const bodyCus: any = {}
      const bodyEmp: any = {}
      bodyCus.pointLoyal = updatePointCus
      bodyEmp.pointLoyal = updatePointEmp
      if (updatePointCus < 500 && updatePointEmp < 500) {
        bodyCus.benefitType = 'No benefit'
        bodyCus.description = 'No benefit'
        bodyEmp.benefitType = 'No benefit'
        bodyEmp.description = 'No benefit'
      } else if (updatePointCus < 2000 && updatePointEmp < 2000) {
        bodyCus.benefitType = 'FreeShip'
        bodyCus.description = 'Free delivery to home'
        bodyEmp.benefitType = '2% salary increase'
        bodyEmp.description = '2% salary increase'
      } else {
        bodyCus.benefitType = 'Discount 10%'
        bodyCus.description = 'Discount 10%'
        bodyEmp.benefitType = '5% salary increase'
        bodyEmp.description = '5% salary increase'
      }
      await updateUserByCode(customer, { loyal: bodyCus })
      await updateUserByCode(employee, { loyal: bodyEmp })
    }

    const orderNew = await createOrder({
      code: nextCode,
      customer,
      employee,
      orderDate: new Date(),
      orderItem,
      orderValue: total,
      transactionType,
      status
    })
    return res.status(httpStatus.CREATED).json({
      message: 'Create order successful',
      data: orderNew
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error created order')
  }
}
export const delOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const order = await getOrderByCode(code)
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'order not found')
    }
    const orderItem = order.orderItem
    orderItem.forEach(async (item) => {
      const productCode: string = item.product!
      const inventory: number = (await getProductByCode(productCode))?.inventory!
      const body: any = { inventory: inventory + item.quantity! }
      await updateProduct(productCode, body)
    })
    const delOrder = await deleteOrder(code)
    return res.status(httpStatus.OK).json({
      message: 'deleted order successful',
      data: delOrder
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error deleted order')
  }
}
//Thống kê theo sản phẩm
export const revenueProduct = async (req: express.Request, res: express.Response) => {
  try {
    const lst = await revenueByProduct()
    if (!lst) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'revenue by product error 1')
    }
    return res.status(httpStatus.OK).json(lst)
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('revenue by product error')
  }
}
export const revenueCustomer = async (req: express.Request, res: express.Response) => {
  try {
    const lst = await revenueByCustomer()
    if (!lst) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'revenue by product error 2')
    }
    return res.status(httpStatus.OK).json(lst)
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('revenue by customer error')
  }
}
export const editOrderItem = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const order = await getOrderByCode(code)
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found')
    }

    const orderItemNew: { product: string; quantity: number; price: number }[] = req.body.orderItem
    const orderItemOld = order.orderItem
    //trả về số lượng cho product
    for (const oldItem of orderItemOld) {
      const productCode: string = oldItem.product!
      const product = await getProductByCode(productCode)
      const inventory: number = product?.inventory!
      const productUpdate: any = { inventory: inventory + oldItem?.quantity! }
      console.log(productUpdate)
      await updateProduct(productCode, productUpdate)
    }
    // Calculate the new total order value
    let total: number = 0

    for (const newItem of orderItemNew) {
      const productCode: string = newItem.product
      const product = await getProductByCode(productCode)

      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found: ' + productCode)
      }

      const inventory: number = product.inventory!

      if (inventory < newItem.quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Too many products: ' + product.name)
      }

      // Update the price from the product data
      newItem.price = product.sellingPrice!

      // Calculate the total price for this item
      const itemTotal = newItem.quantity * newItem.price
      total += itemTotal

      // Update the inventory
      const productUpdate: any = { inventory: inventory - newItem.quantity }
      await updateProduct(productCode, productUpdate)
    }

    // Update the order's orderItem and orderValue
    const newOrderData: any = { orderItem: orderItemNew, orderValue: total }
    const updatedOrder = await updateOrder(code, newOrderData)

    return res.status(httpStatus.OK).json({
      message: 'Updated order successful',
      data: updatedOrder
    })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.BAD_REQUEST).json('Error editing order')
  }
}

export const revenueOrdersByDate = async (req: express.Request, res: express.Response) => {
  try {
    const { date } = req.params
    const orders = await getListOrderDate(date)
    return res.status(httpStatus.OK).json(orders)
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get order by date')
  }
}
export const revenueOrderByMonth = async (req: express.Request, res: express.Response) => {
  try {
    const year: number = parseInt(req.query.year as string)
    const month: number = parseInt(req.query.month as string)
    const orders = await getOrderByMonth(year, month)
    return res.status(httpStatus.OK).json(orders)
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get order by month')
  }
}
export const revenueOrderByYear = async (req: express.Request, res: express.Response) => {
  try {
    const start: string = req.query.start as string
    const end: string = req.query.end as string
    if (!start || !end) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Need to enter enough information start date and end date')
    }
    const revenue = await revenueOrder(start, end)
    if (!revenue) {
      throw new ApiError(httpStatus.NOT_FOUND, 'revenue order not found')
    }
    return res.status(httpStatus.OK).json(revenue)
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get revenue order')
  }
}
