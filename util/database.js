const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=(cb)=>{
MongoClient.connect('mongodb+srv://bcae208924402018:Surya%402001@cluster0.ieth7oj.mongodb.net/shop?retryWrites=true&w=majority')
.then(client=>{
console.log("Connected")
_db=client.db();
cb(client)
})
.catch(err=>{
  console.log(err);
  throw err;
}
);
}

const getDb=()=>{
  if(_db){
    return _db;
  }else{
    throw Error('NO database found');
  }
}


exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
