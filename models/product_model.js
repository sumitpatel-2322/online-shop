const mongodb=require('mongodb');
const db=require('../data/database');
class Product{
    constructor(productData){
        this.title=productData.title;
        this.summary=productData.summary;
        this.price=+productData.price;
        this.description=productData.description;
        this.image=productData.image;
        this.updateImageData();
        if(productData._id){
            this.id=productData._id.toString();
        }
    }
    static async findById(productId){
        let prodId;
        try{
            prodId=new mongodb.ObjectId(String(productId));
        }catch(error)
        {
            error.code=404;
            throw error;
        }
        const product=await db.getDb().collection('products').findOne({_id:prodId});
        if(!product){
            const error=new Error('could not find product with given Id.');
            error.code=404;
            throw error;
        }
        return new Product(product);
    }
    
     static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
      return new mongodb.ObjectId(id);
    })
    
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }
    updateImageData(){
        this.imagePath=`product-data/images/${this.image}`;
        this.imageUrl=`/products/assets/images/${this.image}`;
    }
    static async findAll(){
      const products=await db.getDb().collection('products').find().toArray();
        return products.map(function(productDocument){
            return new Product(productDocument);
        });
    }
    async save(){
        const dataOfProduct={
            title:this.title,
            summary:this.summary,
            price:this.price,
            description:this.description,
            image:this.image
        };
        if(this.id){
            const productId = new mongodb.ObjectId(String(this.id));
            if(!this.image){
                delete dataOfProduct.image;
            }
            await db.getDb().collection('products').updateOne(
                { _id: productId },
                { $set: dataOfProduct }
            );
        }else{
            await db.getDb().collection('products').insertOne(dataOfProduct);
        }
    }
    replaceImage(newImage){
        this.image=newImage;
        this.updateImageData();
    }
     remove(){
        const prodId=new mongodb.ObjectId(String(this.id))
       return db.getDb().collection('products').deleteOne({_id:prodId});
    }
}
module.exports=Product;