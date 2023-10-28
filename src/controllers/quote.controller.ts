import express from 'express'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'

import {
  createQuote,
  deleteQuote,
  findQuote,
  getAllQuote,
  getLastQuote,
  getQuoteByCode,
  updateQuote
} from '../services/quote.service'
import { getUserByCode } from '../services/user.service'
import { getUser } from './user.controller'
import { getProductByCode } from '../services/product.service'
import { generateCode } from '../utils/generateCode'

export const getQuotes = async (req: express.Request, res: express.Response) => {
  try {
    const quotes = await getAllQuote()
    return res.status(httpStatus.OK).json({
      data: quotes
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get all quote')
  }
}
export const getQuote = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const quote = await getQuoteByCode(code)
    if (!quote) {
      throw new ApiError(httpStatus.NOT_FOUND, 'quote not found')
    }
    return res.status(httpStatus.OK).json({
      data: quote
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get quote')
  }
}

export const createQuo = async (req: express.Request, res: express.Response) => {
  try {
    const customer: string = req.body.customer //lấy code khách hàng
    const employee: string = req.body.employee //lấy code nhân viên lập
    const products: { productCode: string; quantity: number; discount: number; price: number }[] = req.body.products
    const description: string = req.body.description
    const existCustomer = await getUserByCode(customer)
    if (!existCustomer) {
      //kiểm tra tồn tại của customer
      throw new ApiError(httpStatus.NOT_FOUND, 'customer not found')
    }
    const existEmployee = await getUserByCode(employee)
    if (!existEmployee) {
      //kiểm tra tồn tại employee
      throw new ApiError(httpStatus.NOT_FOUND, 'employee not found')
    }
    let totalAmount: number = 0 //tổng giá trị hàng
    let discountTotal: number = 0 //tổng giá trị giảm
    for (const product of products) {
      const existProduct = await getProductByCode(product.productCode)
      if (!existProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found')
      }
      if (product.quantity > existProduct?.inventory!) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'too many products ' + existProduct.name)
      }
      product.price = existProduct.sellingPrice!
      totalAmount += product.price * product.quantity
      discountTotal += (totalAmount * product.discount) / 100
    }
    const lastQuote = await getLastQuote()
    let nextCode = 'BG1'
    if (lastQuote) {
      const lastCode = lastQuote.code!
      nextCode = generateCode(lastCode)
    }
    const newQuote = await createQuote({
      code: nextCode,
      customer,
      employee,
      date: new Date(),
      products,
      totalAmount,
      discountTotal,
      description
    })
    return res.status(httpStatus.CREATED).json({
      message: 'created quote successful',
      data: newQuote
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error created quote')
  }
}
export const findQuo = async (req: express.Request, res: express.Response) => {
  try {
    const { customer, employee } = req.query
    const conditions: any = {}
    if (customer) {
      conditions.customer = customer
    }
    if (employee) {
      conditions.employee = employee
    }
    if (Object.keys(conditions).length <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No data quote available')
    }
    const quotes = await findQuote(conditions)
    if (!quotes) {
      throw new ApiError(httpStatus.NOT_FOUND, 'quote not found')
    }
    return res.status(httpStatus.OK).json({
      message: 'successful',
      data: quotes
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error find quote')
  }
}
export const editQuote = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const quote = await getQuoteByCode(code)
    const products: { productCode: string; quantity: number; discount: number; price: number }[] = req.body.products
    if (!quote) {
      throw new ApiError(httpStatus.NOT_FOUND, 'quote not found')
    }
    let totalAmount: number = 0 //tổng giá trị hàng
    let discountTotal: number = 0 //tổng giá trị giảm
    for (const product of products) {
      const existProduct = await getProductByCode(product.productCode)
      if (!existProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found')
      }
      if (product.quantity > existProduct?.inventory!) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'too many products ' + existProduct.name)
      }
      product.price = existProduct.sellingPrice!
      totalAmount += product.price * product.quantity
      discountTotal += (totalAmount * product.discount) / 100
    }
    const body: any = { totalAmount, discountTotal, products }
    const newQuote = await updateQuote(code, body)
    return res.status(httpStatus.OK).json({
      message: 'updated quote successful',
      data: newQuote
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error edit products')
  }
}
export const delQuote = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const existQuote = await getQuoteByCode(code)
    if (!existQuote) {
      throw new ApiError(httpStatus.NOT_FOUND, 'quote not found')
    }
    const quote = await deleteQuote(code)
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'delete quote successful',
      data: quote
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error delete quote')
  }
}
