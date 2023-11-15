import express from 'express'
import { getLoyalByCode, getUserByCode, updateUserByCode } from '../services/user.service'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'

export const getLoyal = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const user = await getLoyalByCode(code)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
    }
    return res.status(httpStatus.OK).json({
      data: user
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error get loyal by code')
  }
}
export const editLoyal = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const { pointLoyal } = req.body
    const existUser = await getUserByCode(code)
    if (!existUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
    }
    const role = existUser.role
    const body: any = {}
    body.pointLoyal = pointLoyal
    if (role == 'customer') {
      if (pointLoyal < 500) {
        body.benefitType = 'No benefit'
        body.description = 'No benefit'
      } else if (pointLoyal < 2000) {
        body.benefitType = 'FreeShip'
        body.description = 'Free delivery to home'
      } else {
        body.benefitType = 'Discount 10%'
        body.description = 'Discount 10%'
      }
    }
    if (role == 'employee') {
      if (pointLoyal < 500) {
        body.benefitType = 'No benefit'
        body.description = 'No benefit'
      } else if (pointLoyal < 2000) {
        body.benefitType = '2% salary increase'
        body.description = '2% salary increase'
      } else {
        body.benefitType = '5% salary increase'
        body.description = '5% salary increase'
      }
    }
    const user = await updateUserByCode(code, { loyal: body })
    return res.status(httpStatus.OK).json({
      message: 'update loyal successful',
      data: user
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'error edit loyal user'
    })
  }
}
