const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require("nodemailer");


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

const companyName = "ITDen"
const fromEmail = "mailer@iden.net"
const hostName = "http://localhost:3000/"





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

//    findOne in the Password schema. Find using inputcode var against 'code' key pair. With found document, check pass document key and render it in opt2 partial.
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

app.post("/sendMail", function(req,res){
    console.log(req.body);

// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "itden-net.mail.protection.outlook.com",
      port: 25,
      secure: false, // true for 465, false for other ports
      // auth: {
      //   user: testAccount.user, // generated ethereal user
      //   pass: testAccount.pass, // generated ethereal password
      // },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "'"+companyName+"<"+fromEmail +">'", // sender address
      to: req.body.email, // list of receivers
      subject: "Here's your PassPass Code from "+companyName+"!", // Subject line
    //   text: "Hello world?", // plain text body
      html: "<h1>Hello! here's your code!</h1></br><h2>" + req.body.code + "</h2></br><p>Please go to <a href="+hostName+">"+hostName+"</a> with your code to retreive your password!</p>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  main().catch(console.error);

res.redirect("/");
});

app.listen(3001, function(){
    console.log("Server started on port 3000")
});
