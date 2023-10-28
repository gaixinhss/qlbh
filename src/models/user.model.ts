import mongoose from 'mongoose'
import validator from 'validator'
import { roles } from '../config/roles'
const Schema = mongoose.Schema
const userSchema = new Schema(
  {
    code: {
      // manager : AD***, customer : KH*** , employee : EM*** ; *** là số tự tăng
      type: String,
      require: true,
      unique: true
    },
    username: {
      // chuỗi khác trống
      type: String,
      require: true
    },
    password: {
      // ít nhất 8 kí tự , ít nhất 1 số và kí tự
      type: String,
      require: true,
      minLength: 8,
      trim: true,
      validate(value: any) {
        if (!value.match(/\d/ || !value.match(/[a-zA-Z]/))) {
          throw new Error('password must contain at least one letter and one number')
        }
      }
    },
    email: {
      // duy nhất, phải định dạng theo email, check email đã tồn tại trong db chưa
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(email: any) {
        if (!validator.isEmail(email)) {
          throw new Error('Invalid email')
        }
      }
    },
    role: {
      // gồm 3 quyền, mặc định là customer
      type: String,
      enum: ['customer', 'managerUser', 'employee'],
      default: 'customer'
    },
    phone: {
      type: String,
      minLength: 10,
      maxLengTh: 11
    },
    address: {
      type: String,
      require: true
    },
    loyal: {
      //Không được nhập, điểm tự tăng khi mua hàng
      pointLoyal: { type: Number, min: 0 },
      benefitType: { type: String },
      description: { type: String }
    }
  },
  {
    timestamps: true
  }
)
export const userModel = mongoose.model('User', userSchema)
