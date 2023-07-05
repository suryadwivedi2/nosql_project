const mongodb=require('mongodb')
const getdb=require('../util/database').getDb;

class User{
  constructor(username,email){
    this.name=username;
    this.email=email;
  }
  save(){
   const db=getdb();
    return db.collection('users').insertOne(this);
  }

static findbyId(userId){
const db=getdb();
return db.collection('users').findOne({_id:new mongodb.ObjectId(userId)})
.then(users=>{
  console.log(users);
  return users;
})
.catch(err=>console.log(err))
  }
}

module.exports = User;
