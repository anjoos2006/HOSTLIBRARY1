const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const  cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');


const Book = require('./models/book');
const User = require('./models/user');

const app = express();

// Middleware
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(express.static('./dist/frontend'));

app.use(cors());

// Import Routes
// const booksRoute = require('./routes/books');
// const usersRoute = require('./routes/users');

// app.use('/books',express.raw({ type: '*/*' }),booksRoute);
// app.use('/users',express.raw({ type: '*/*' }),usersRoute);

// *************** Routes for the user starts here ********************

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    console.log("payload is",payload)
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

app.post('/api/users/signup', async (req, res) => {
    console.log("in user route");
    console.log(req.body.User.email);
    console.log("req body:");
    console.log(req.body);
        
    const user = new User({
        name: req.body.User.name,
        email: req.body.User.email,
        username: req.body.User.username,
        password: req.body.User.password
    });
    
    try{
    const savedUser = await user.save();
        res.json(savedUser);
        console.log("saved"+savedUser);
     }catch(err){
        res.json({ message: err });
     }   
});

app.post('/api/users/login', (req, res) => {
    var flag=false;
    
        const pwd = req.body.User.password;
        
        const uname = req.body.User.username;

        console.log("within login",req.body)

        // let getUser;
        
    
        User.findOne({"username":uname}).then(function(getUser){
        // res.json(getUser);
        console.log("getUser"+getUser);
        if (getUser == null) {
            console.log("In null")
            res.json({"error": "This email address is not recognised, please check you have entered your email correctly"});
          } 
        else{
            console.log("In not null")
          if (pwd == getUser.password){
            console.log("Valid login")
            
            flag = true
            console.log(getUser);
            let payload={subject:getUser.username+getUser.password}
            let token = jwt.sign(payload,'secretKey')
            console.log("token is",token)
            res.status(200).json({token}) 
            } 
          else{
            res.json({"error":"Sorry your password is incorrect"});
            console.log("Incorrect password");
          }
        }
        
    }
  )})
  
//   *************** Routes for the user ends here *******************

// ***************** Routes for the books starts here ****************
app.get('/api/books', async (req, res) => {
    try{
        const book = await Book.find(); 
        res.json(book);
        console.log(book);
    }catch(err){
        res.json({message: err})
    }
})

app.get('/api/books/:id', async (req,res)=>{
    console.log("in book route");
    console.log(req.params);
    try{
        const id = req.params.id;
        const getBook = await Book.findById({"_id":id}); 
        res.json(getBook);
        console.log("getBook"+getBook);
    }catch(err){
        console.log("In error /book");
        res.json({message: err})
    }
  })

app.delete('/api/books/remove/:id', async (req,res)=>{
    try{
        const id = req.params.id;
        const deletedBook = await Book.findByIdAndDelete({"_id":id}); 
        res.json(deletedBook);
        console.log("deleetd"+deletedBook);
    }catch(err){
        console.log("In error /remove");
        res.json({message: err})
    }
  })

app.post('/api/books/add', verifyToken, async (req, res) => {
    console.log("in book route");
    console.log(req.body.Book.title);
    console.log("req body:");
    console.log(req.body);    
    const book = new Book({
        title: req.body.Book.title,
        image: req.body.Book.image,
        author: req.body.Book.author,
        about: req.body.Book.about
    });
    
    try{
    const savedBook = await book.save();
        res.json(savedBook);
        console.log("saved"+savedBook);
     }catch(err){
        console.log("In error /add")
        res.json({ message: err });
     }   
});

app.put('/api/books/update', async (req, res) => {
    console.log("in book route");
    console.log(req.body.title);
    console.log("req body:");
    console.log(req.body);    
    
    try{
    await Book.findByIdAndUpdate({"_id":req.body._id},
             {$set:{"title":req.body.title,
                    "image":req.body.image,
                    "author":req.body.author,
                    "about": req.body.about
             } }
    )}catch(err){
        console.log("In error /update")
        res.json({ message: err });
     }   
}); 

// ****************************** Routes for the book ends here *******************
app.put('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
   });
   
   const PORT =process.env.PORT || 3000

// Connect to DB
mongoose.connect(process.env.dbUrl, { useNewUrlParser: true }, () => { 
    console.log("Connected to DB")
});

app.listen(PORT)