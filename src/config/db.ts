import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongodb_url = process.env.MONGODB_URL!

mongoose.connect(mongodb_url)

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to database ' + err)
})
mongoose.connection.on('connected', (res) => {
  console.log('Connected successfully with database')
})
