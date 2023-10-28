import { productModel } from '../models/product.model'

export const getAllProduct = () => productModel.find()
export const findProduct = (conditions: any) => productModel.find(conditions)
export const getProductByCode = (code: string) => productModel.findOne({ code })
export const createProduct = (values: Record<string, any>) =>
  new productModel(values).save().then((product) => product.toObject())
export const updateProduct = (code: string, values: Record<string, any>) =>
  productModel.findOneAndUpdate({ code }, values, { new: true })
export const deleteProduct = (code: string) => productModel.findOneAndRemove({ code })

export const getLastProduct = () => productModel.findOne({}, {}, { sort: { _id: -1 } })

export const updateHistoryPrice = (code: string, arr: any) =>
  productModel.findOneAndUpdate({ code }, { $push: { priceHistory: arr } })

export const getHistoryPrice = (code: string) =>
  productModel.find({ code }, { _id: false, code: true, sellingPrice: true, priceHistory: true })

export const deletePromotion = (code: string) => productModel.findOneAndUpdate({ code }, { $unset: { promotion: '' } })

export const findPromotion = (code: string) => productModel.findOne({ code }, { _id: false, promotion: true })
