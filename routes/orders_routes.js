const express=require('express');
const ordersController=require('../controllers/orders_controller');
const router=express.Router();
router.post('/',ordersController.addOrders);
router.get('/',ordersController.getOrders);
module.exports=router;