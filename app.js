// added required packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//conection to db
mongoose.connect("mongodb://127.0.0.1:27017/todolistdb");



// creating item schema
const itemschema ={
  name : String
};

// creating mongose model
const Item = mongoose.model("Item", itemschema);


// creating data 
const item1 = new Item({
  name : "welcome to your to do list "
});

const item2 = new Item({
  name : "hit the add button to add a new item"
});

const item3 = new Item({
  name : " < -- hit this to delete item"
});



const defaultItems =[item1,item2,item3]


// inserting data in db 
// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("succesfully saved dfaultitem to the db ")  
//     }
// });



app.get("/", function(req, res) {


// find the data
Item.find({}, function (err, founditem) {
  if (founditem.length === 0){
      // inserting data in db 
Item.insertMany(defaultItems,function(err){
    if(err){
        console.log(err);
    } else {
        console.log("succesfully saved dfaultitem to the db ")  
    }
});
res.redirect("/");
  }
  else{
    res.render("list", {listTitle: "Today", newListItems:founditem});
  }
});



});

app.get("/:customListName" , function(req, res){
  const customListName = req.params.customListName;

})


app.post("/", function(req, res){

  const itemName =req.body.newItem;
  const item= new Item({
    name : itemName
});
item.save();

res.redirect('/');


// deleted this part of code cause its not needed
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }


});


app.post("/delete",function(req,res){
   const checkedItemId = req.body.checkbox;

   Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err){
      console.log("succesfully Deleted checked item.");
      res.redirect("/");
    }

   });
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
