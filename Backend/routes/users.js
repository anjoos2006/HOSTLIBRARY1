const express = require ('express');
const router = express.Router();
const User = require('../models/user');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.urlencoded({extended: true})); 
app.use(express.json());


router.post('/signup', async (req, res) => {
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

router.post("/login", async (req,res) => {
    var flag=false;
    
        const pwd = req.body.User.password;
        
        const uname = req.body.User.username;

        // let getUser;
        
    
        await User.findOne({"username":uname}).then(function(getUser){
        // res.json(getUser);
        console.log("getUser"+getUser);
        if (!getUser) {
          res.status(401).send('Invalid Username')
        } else 
        if ( password !== pwd) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = {subject: username+password}
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).json({token:token})
        }
        
        
    }
  )})
  
  module.exports = router;
