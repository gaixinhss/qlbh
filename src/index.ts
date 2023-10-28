import { app } from './app'
import dotenv from 'dotenv'

dotenv.config()
import './config/db'
const port = process.env.PORT

const server = app.listen(port, (): void => {
  console.log('Server is running at ' + port)
})
