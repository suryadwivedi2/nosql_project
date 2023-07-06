const path = require('path');
const mongoose = require('mongoose');
//const mongoConnect=require('./util/database').mongoConnect;

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('64a6cbd71ab86147dfc3209b')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://bcae208924402018:Surya%402001@cluster0.ieth7oj.mongodb.net/shop?retryWrites=true&w=majority')
  .then(result => {
    console.log("Connected!")
    User.findOne().then(user=>{
      if(!user){
        const user = new User({
          name: 'surya',
          email: "test@gmail.com",
          cart: {
            items: []
          }
        })
        user.save();
      }
    })
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })