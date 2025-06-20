const express=require('express');
const productsController=require('../controllers/products_controller');
const router=express.Router();
router.get('/products',productsController.getAllProducts);
router.get('/products/:id',productsController.getProductdetails);
module.exports=router;