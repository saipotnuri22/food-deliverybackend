//importing all required modules after instation
const express = require('express')
const mongoose= require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt = require('bcrypt')

//middleware 
const PORT = 3000
const app = express() 
app.use(express.json())

//connecting Mongodb Atlas
mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("DB connected successfully")
).catch(
    (err) => console.log(err)
)

//ApI landing page http://localhost:3000/
app.get('/',async(req, res)=>{
    try{
         res.send("<h1 align='center'>welcome to the food delivery</h1>")

    }  
    catch(err){
        console.log(err)
    }
})
// API registration page http://localhost:3000/register
app.post('/register', async (req, res) => { // Add missing '/'
    const { user, email, password } = req.body;
    try {
        const hashedpassword = await bcrypt.hash(password, 10); // Fix bcrypt usage
        const newUser = new User({ user, email, password: hashedpassword }); // Use hashed password
        await newUser.save();
        console.log("New registered successfully");
        res.json({ message: "User created" });
    } catch (err) {
        console.log(err);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) { // Fix bcrypt usage
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Login successful", username: user.user }); // Fix response
    } catch (err) {
        console.log(err);
    }
});

//server running and testing

app.listen( PORT,(err)=> {
    if (err) {
        console.log(err)
    }
    console.log("Server is running on port | this raghu : "+PORT)
})