const express = require ('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
    try{
        const book = await Book.find(); 
        res.json(book);
        console.log(book);
    }catch(err){
        res.json({message: err})
    }
})

router.get('/:id', async (req,res)=>{
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

router.delete('/remove/:id', async (req,res)=>{
    try{
        const deletedBook = await Book.findByIdAndDelete({"_id":id}); 
        res.json(deletedBook);
        console.log("deleetd"+deletedBook);
    }catch(err){
        console.log("In error /remove");
        res.json({message: err})
    }
  })

router.post('/add', async (req, res) => {
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

router.put('/update', async (req, res) => {
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
module.exports = router;