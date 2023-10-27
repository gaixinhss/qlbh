import express from 'express'
import { deleteUser, findUs, getUser, getUsers, updateUser } from '../controllers/user.controller'
import { checkCustomer, checkEmployee, checkManager } from '../middlewares/checkRole';

export default(router:express.Router)=>{
    router.get("/users",checkManager,getUsers);
    router.get('/user/:code',checkEmployee,getUser)
    router.put('/user/:code',checkCustomer,updateUser);
    router.delete('/user/:code',checkManager,deleteUser)
    router.get('/tim-kiem-user',checkCustomer,findUs)
}
