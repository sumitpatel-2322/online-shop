const express=require('express');
const router=express.Router();
const adminController=require('../controllers/admin_controller');
// const imageUploadMiddleware=require('../middlewares/imageUpload')
router.get('/products',adminController.getProducts);
router.get('/products/new',adminController.getNewProduct);
router.post('/products',adminController.createNewProduct);
router.get('/products/:id',adminController.getUpdateProduct);
router.post('/products/:id',adminController.updateProduct);
router.delete('/products/:id',adminController.deleteProduct);
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id', adminController.updateOrder);
module.exports=router;