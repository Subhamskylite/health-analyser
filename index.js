const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");
const bcrypt=require('bcrypt');
require('dotenv').config()

const mongouri=process.env.DATABASE;

mongoose.connect(mongouri, {
    useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
})


const port = process.env.PORT || 5000;


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    }
})

userSchema.pre('save',async function(next){
    try {
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(this.password,salt)
        this.password=hashedPassword
        const hashedPassword2=await bcrypt.hash(this.confirmpassword,salt)
        this.confirmpassword=hashedPassword2
        next()
    } catch (error) {
        next(error)
    }
})

const Register = new mongoose.model('Register', userSchema);



const public_path = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(public_path));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;
        

        const usermail = await Register.findOne({ email: email })

        

        if (bcrypt.compareSync(password,usermail.password)) {
            res.status(200).render('index',{username:usermail.name})
        }
        else {
            
            res.render('login',{msg:'Incorrect password'})
            
        }


    } catch (error) {
        
        res.render('login',{msg:'Invalid Email'})
    }

})

app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {

    try {
        email=req.body.email;
        let usermail=await Register.findOne({ email:email });


        if(usermail){
            return res.render('register',{msg:'Email already registered.Please login'})
        }

        
        const pass = req.body.password;
        const cpass = req.body.confirmpassword;

        if (pass === cpass) {

            bcrypt.hash(pass,10,function(err,hash){

                if(err){
                    res.render('register',{msg:'Something went wrong'}) 
                }else{
                    const userinfo = new Register({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        confirmpassword: req.body.confirmpassword,
        
                    })
        
                    
        
                    const registered = userinfo.save();
                    res.status(200).render('index',{username:req.body.name});
        

                }
            })

        } else {
            
            res.render('register',{msg:'Password are not matching'})
        }


    } catch (error) {
        res.status(400).send(error);
    }

})


app.get('/index', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`server listening on ${port}`);
});
