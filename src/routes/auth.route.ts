import express from 'express'
import { login, logout, register } from '../controllers/auth.controller'

export default(router:express.Router)=>{
    router.post('/auth/register',register);
    router.post('/auth/login',login);
    router.get('/auth/logout',logout)
}