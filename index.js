import cookieParser from 'cookie-parser';
import express from 'express';
import jwt from 'jsonwebtoken';


import mongoose from 'mongoose';
import path from 'path';


mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"buababa",
}).then(() => {console.log("connected")
    
}).catch((e) => {console.log(e)
    
})
const messegeSchema= new mongoose.Schema({
    name:String,
    email:String
})
const messege=mongoose.model("messege",messegeSchema)

const userSchema= new mongoose.Schema({
    name:String,
    email:String
})
const user=mongoose.model("user",userSchema)
const app=express();
//middlewares
//app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.set("view engine","ejs")

app.get("/",async(req,res)=>{
    const {token}=req.cookies
   
    
    if(token){
        const t= await  jwt.verify(token,"hgdhgdkdjkasbh")
    req.user=await user.findById(t._id)
        res.render("logout")
    }else{
        res.render("login")
    }
    

})
// app.get("/add",(req,res)=>{
//     messege.create({
//         // name:"mohd Fuzail",
//         // email:"mohdfuzail@gmail.com"
//         users
//     }).then(()=>{
//          res.send("ok")
//     })
    
// })
// app.get("/user",(req,res)=>{
//     res.json({
//         users,
//     })
// })
// app.get("/sucess",(req,res)=>{
   
//     res.render("sucess")
// })

app.post("/login",async(req,res)=>{
    const {name,email}=req.body;
   
  
   

    const userdetail=await user.findOne({email})
    if(userdetail){
    const tokenvalue=jwt.sign({_id:userdetail._id},"hgdhgdkdjkasbh")
    res.cookie("token",tokenvalue,
    {httpOnly:true,
    expires:new Date(Date.now()+60*1000)}
    )
    
   
   res.render("logout")
}else{
    res.render("register")
}
})

app.post("/register",async(req,res)=>{
    const {name,email}=req.body;
    const User =await user.create({name ,email})
    const tokenvalue=jwt.sign({_id:User._id},"hgdhgdkdjkasbh")
    res.cookie("token",tokenvalue,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    })
    res.render("logout")
})

app.get("/logout",async(req,res)=>{
    res.cookie("token",null,
    {httpOnly:true,
    expires:new Date(Date.now())}
    )
  
   res.render("login")
     
})

app.listen(5000,()=>{
    console.log("hiii");
})