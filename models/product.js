const mongodb = require('mongodb')

const getDb = require('../util/database').getDb;
class Product {
  constructor(title, price, description, imageUrl, id,userid) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userid=userid;
  }
  save() {
    const db = getDb();
    let dbp;
    if (this._id) {
      dbp = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
    } else {
      dbp = db.collection('products')
        .insertOne(this)
    }
    return dbp
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
      .then((result) => {
        console.log(result)
        return result;
      })
      .catch(err => console.log(err));
  }

  static findbyId(prodId) {
    const db = getDb();
    return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        console.log(product)
        return product;
      })
      .catch(err => console.log(err))
  }


  static deletebyId(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(res => {
        console.log("deleted");
      })
      .catch(err => console.log(err))
  }
}


module.exports = Product;
