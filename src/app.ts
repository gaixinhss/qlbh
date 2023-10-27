import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'
import errorHandler from './middlewares/errorHandle'

import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({credentials:true}));
app.use(cookieParser());
app.use(errorHandler);

app.use('/',router());



export {app};