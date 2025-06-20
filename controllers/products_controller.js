
const Product=require('../models/product_model');


async function getAllProducts(req,res,next){
    try{
        const products=await Product.findAll()
        res.render('customer/products/all-products',{products:products});
    }catch(error){
        next(error);
    }
}
async function  getProductdetails(req,res,next){
    try{
        const  product=await Product.findById(req.params.id);
        res.render('customer/products/product-details',{product:product});
    }catch(error){
        next(error);
    }
}
module.exports={
    getAllProducts:getAllProducts,
    getProductdetails:getProductdetails
}