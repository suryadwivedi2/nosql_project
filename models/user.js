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
    const cartProductindex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() == product._id.toString();
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]
    if (cartProductindex >= 0) {
      newQuantity = this.cart.items[cartProductindex].quantity + 1;
      updatedCartItems[cartProductindex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    //const updatedcart = { items: [{ productId: new mongodb.ObjectId(product._id), quantity: newQuantity }] }
    const db = getdb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
  }

  getCart() {

    const db = getdb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p, quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          }
        })
      })
      .catch()
  }

  deleteItemCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId != productId
    });

    const db = getdb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )

  }

  addOrder() {
    const db = getdb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name,
          }
        }
        return db.collection('orders')
          .insertOne(order)
          .then(result => {
            this.cart = { items: [] }
            return db
              .collection('users')
              .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { items: [] } } }
              )
          })
      })
      .catch(err => console.log(err))
  }

  getOrders() {
   const db=getdb();
   return db.collection('orders')
   .find({'user._id':new mongodb.ObjectId(this._id)})
   .toArray();
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
