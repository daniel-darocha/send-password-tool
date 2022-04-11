const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/password-app');
  }

const passwordSchema = new mongoose.Schema({
    code: Number,
    pass: String, 
});
const Password = mongoose.model('Password', passwordSchema);

function newEntry(opt1,opt2){
    new Password({code: opt1, pass: opt2}).save()
};





// Create new password document in Passwords Collection
// new Password({code: 567999, pass: 'asd612sssa'}).save();

// Global Constants & Variables

// GET Routes
app.get("/", function(req,res){

    res.render('home',{});
});

app.get("/sendpass",function (req,res) { 

    res.render('create',{});
 });

 app.get("/getpass", function (req,res) { 

    res.render('getPass',{});
  })




// POST Routes
app.post("/sendpass-generate", function(req,res){
    var code = Math.floor(100000 + Math.random() * 900000)
    var pw = req.body.pw
    var opt1 = "Here's the code to retrieve your password!"
    console.log(pw)
    console.log(code);

    newEntry(code, pw);

    res.render("floating",{opt1: opt1, opt2: code});
});

app.post("/getpass-generate", function(req,res){
    const opt1 = "Here is your Password! please save it, it will be removed from the database in 120 Seconds!"
    var code = req.body.pw
  
    Password.findOne({ 'code': code }, 'pass', function (err, Password) {
        if (err){ return handleError(err)}
        else {
            console.log(Password.pass)
            res.render("floating",{opt1: opt1, opt2: Password.pass})
        }
      });
 
});

app.listen(3000, function(){
    console.log("Server started on port 3000")
});
