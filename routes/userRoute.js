const express=require('express')
const user=express.Router();
const userController=require('../controller/usercontrol')

user.get('/register',userController.signup);
user.post('/register',userController.signupPost);
user.post('/login',userController.loginPost);
user.get('/home',userController.home)
user.get('/logout',userController.logout)

module.exports=user;