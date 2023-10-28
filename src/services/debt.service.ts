import { debtModel } from '../models/debt.model'

export const getAllDebt = () => debtModel.find()
export const getDebtByCode = (code: string) => debtModel.find({ code })

export const findDebt = (conditions: any) => debtModel.find(conditions)

export const createDebt = (value: Record<string, any>) => new debtModel(value).save().then((debt) => debt.toObject())
export const updateDebt = (code: string, value: Record<string, any>) =>
  debtModel.findOneAndUpdate({ code }, value, { new: true })
export const deleteDebt = (code: string) => debtModel.findOneAndRemove({ code })

export const getLastDebt = () => debtModel.findOne({}, {}, { sort: { _id: -1 } })
