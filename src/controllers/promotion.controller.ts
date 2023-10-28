import express from 'express'
import { deletePromotion, findPromotion, getProductByCode, updateProduct } from '../services/product.service'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'

export const addPromotion = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const body = req.body
    const product = await await getProductByCode(code)
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product not found')
    }

    if (
      !(
        body.promotion.promotionName! ||
        body.promotion.start! ||
        body.promotion.end! ||
        body.promotion.type! ||
        body.promotion.details! ||
        body.promotion.discountRate!
      )
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Data cannot be left blank')
    }
    const productUpdate = await updateProduct(code, body)
    return res.status(httpStatus.OK).json({
      message: 'successful promotion',
      data: productUpdate
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error add ')
  }
}
export const deletePromo = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const product = await getProductByCode(code)
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product not found')
    }
    const delPromotion = await deletePromotion(code)
    return res.status(httpStatus.OK).json({
      message: 'deleted promotion successful',
      data: delPromotion
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error deleted promotion')
  }
}
export const findPromo = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const product = await findPromotion(code)
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product not found')
    }
    return res.status(httpStatus.OK).json({
      data: product
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error find promotion by product code')
  }
}
