import express from 'express'
import { delUserByCode, getAllUser, getUserByCode, updateUserByCode, findUser } from '../services/user.service'
import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getAllUser()
    return res.status(httpStatus.OK).json(users)
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error getUsers')
  }
}
export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params!
    const user = await getUserByCode(code)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return res.status(httpStatus.OK).json({
      data: user
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error getUser')
  }
}
export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const body = req.body
    const user = await updateUserByCode(code, body)
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'error update customer 1')
    }
    return res.status(200).json({
      message: 'Update successful',
      data: user
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error update user')
  }
}
export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { code } = req.params
    const user = await delUserByCode(code)
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'error deleted user 1')
    }
    return res.status(httpStatus.OK).json({
      message: 'delete user successfull',
      data: user
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error deleted user')
  }
}
export const findUs = async (req: express.Request, res: express.Response) => {
  try {
    const { code, username, phone, address } = req.query
    const conditions: any = {}
    if (code) {
      conditions.code = code
    }
    if (username) {
      conditions.username = username
    }
    if (phone) {
      conditions.phone = phone
    }
    if (address) {
      conditions.address = address
    }

    if (Object.keys(conditions).length <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No data customer available')
    }
    const users = await findUser(conditions)
    return res.status(httpStatus.OK).json({
      data: users
    })
  } catch (error) {
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json('error find user')
  }
}
