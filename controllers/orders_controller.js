const Order = require("../models/orders_model");
const User = require("../models/user_model");

async function getOrders(req, res,next) {
  try {
    const orders = await Order.findAllForUser(res.locals.id);
    res.render('customer/orders/all-orders', {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrders(req, res,next) {
  const cart = res.locals.cart;
  let userDocument
  try {
    userDocument = await User.findById(res.locals.id);
  } catch (error) {
    next(error);
    return;
  }
  const order = new Order(cart,userDocument);
  try{
     await order.save();
  }catch(error){
    next(error);
    return;
  }
  req.session.cart=null;
  res.redirect('/orders');
}
module.exports = {
  addOrders: addOrders,
  getOrders:getOrders
};
