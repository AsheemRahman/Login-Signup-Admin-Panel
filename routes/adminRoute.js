const express=require('express');
const admin=express.Router();
const adminController=require('../controller/admincontrol')

admin.get('/',adminController.admin)
admin.get('/login',adminController.login)
admin.post('/login',adminController.loginPost)
admin.get('/home',adminController.home)
admin.get('/logout',adminController.logout)
admin.get('/edit/:id',adminController.editUser)
admin.post('/userUpdate/:id',adminController.updateUser)
admin.get('/userDelete/:id',adminController.deleteUser)
admin.get('/addUser',adminController.addUser)
admin.post('/newUser',adminController.newUser)


module.exports=admin;