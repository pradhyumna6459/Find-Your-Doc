const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express();
const mongoose=require('mongoose');
const dir=__dirname;
const nodemailer = require("nodemailer");
const { text } = require("body-parser");
require('dotenv').config();
var username="";
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/doctorDB");
const doctorSchema=new mongoose.Schema({
    name:String,
    email:String,
    address:String,
    specialization:String,
    password:String

}
);
const userSchema=new mongoose.Schema({
email:String,
name:String,
password:String

});
const Doctor=new mongoose.model("Doctor",doctorSchema);
const User=new mongoose.model("User",userSchema);
app.post('/doctor',function(req,res){
    const item=new Doctor({
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        specialization:req.body.specialization,
        password:req.body.password

    });
    item.save();
    res.redirect('/');
});
app.post('/register',function(req,res){
    const item=new User({
        name:req.body.name,
        email:req.body.username,
        password:req.body.password
    });
    item.save();
    res.redirect("/login");

});
app.post('/login',function(req,res){
    User.find({email:req.body.username},function(err,result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(req.body.password === result[0].password)
            {
                User.find({email:req.body.username},function(err,result1)
                {
                    if(result1)
                    {
                        username=result1[0].name;
                        res.render('afterlogin',{username:username});
                    }

                });
                
            }
            else{
                res.redirect("/register");
            }
        }

    });

});
app.post('/book',function(req,res){
    const ans=req.body.problem;
    Doctor.find({specialization:ans},function(err,result)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("showdoctor",{username:username,list:result});
        }
    });

});
app.post('/showdoctorbook',function(req,res)
{
    res.render("finalbook",{username:username,doctoremail:req.body.doctoremail});
});
app.post("/finalemailsend",function(req,res)
{
    var test='Name:'+req.body.name+"\n"+"Problem:"+req.body.problem+'\n'+"date:"+req.body.data+'\n'+"time:"+req.body.time+'\n'+"Message:"+req.body.message;
    var ans=req.body.sendemail;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAILID,
          pass: process.env.PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.EMAILID,
        to: ans,
        subject: 'Mail from Find you doctor Web Applications',
        text: test      
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(info);
          res.render("thankyou");
        }
      });
    
});

app.post('/aboutus',function(req,res){
    res.render("aboutus");
});
app.post('/',function(req,res){
    res.render("login");

});
app.get('/',function(req,res){
    res.sendFile(dir+"/index.html");

});
app.get('/aboutus',function(req,res)
{
res.render("aboutus");
});
app.get('/login',function(req,res){
res.render("login");
});
app.get('/register',function(req,res){
res.render("register");
});
app.get('/Doctor',function(req,res){
    res.render("doctor");
});


app.listen(3000,function(req,res){
    console.log("app is started");
});