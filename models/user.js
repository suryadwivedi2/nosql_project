const mongodb = require('mongodb')
const getdb = require('../util/database').getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    const db = getdb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductindex = this.cart.findIndex(cp => {
      return cp.productId == product._id;
    })
    let newQuantity = 1;
    const updatedCartItems=[...this.cart.items]
    if (cartProductindex >= 0) {
      newQuantity = this.cart.items[cartProductindex].quantity + 1;
      updatedCartItems[cartProductindex].quantity=newQuantity;
    }else{
      updatedCartItems.push({
        productId:new mongodb.ObjectId(product._id),
        quantity:newQuantity
      });
    }
    const updatedCart={
      items:updatedCartItems
    };

    const updatedcart = { items: [{ productId: new mongodb.ObjectId(product._id), quantity: newQuantity}] }
    const db = getdb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedcart } }
      )
  }

  static findbyId(userId) {
    const db = getdb();
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
      .then(users => {
        console.log(users);
        return users;
      })
      .catch(err => console.log(err))
  }
}

module.exports = User;
