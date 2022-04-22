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

var companyName = "B2B Dev Network"



// Create new password document in Passwords Collection
// new Password({code: 567999, pass: 'asd612sssa'}).save();

// Global Constants & Variables

// GET Routes
app.get("/", function(req,res){

    res.render('home',{companyName:companyName });
});

app.get("/sendpass",function (req,res) { 

    res.render('create',{companyName:companyName });
 });

 app.get("/getpass", function (req,res) { 

    res.render('getPass',{companyName:companyName });
  })
app.get("/error", function (req,res){
    res.render('error',{companyName:companyName });
})



// POST Routes
app.post("/sendpass-generate", function(req,res){
    time = 120;
    var code = Math.floor(100000 + Math.random() * 900000)
    var pw = req.body.pw
    var opt1 = "Here's the code to retrieve your password!"
    console.log(pw)
    console.log(code);

    newEntry(code, pw);

    res.render("floating",{opt1: opt1, opt2: code, companyName:companyName});
});

app.post("/getpass-generate", function(req,res){
    const opt1 = "Here is your Password! please save it, it will be removed from the database in "
    var inputCode = req.body.pw

   
            Password.findOne({ 'code': inputCode }, 'code pass', function (err, password) {
                if(err){
                    console.log(err)
                    res.redirect("/error")
                }
                if(password === null){
                    res.redirect("/error")
                }
                else{
                    console.log(password.pass)
                    res.render("floating2",{opt1: opt1, opt2: password.pass, companyName:companyName}) };
                    Password.deleteOne({ 'code': inputCode }, function (err) {
                        if (err) return handleError(err);
                      });
              });
        
    

    
  
  
 
});

app.listen(3000, function(){
    console.log("Server started on port 3000")
});
