require('dotenv').config()
const express = require('express')
const cors = require("cors");
const app = express();
const body_parser = require("body-parser");


const voterRouter = require('./route/voterRouter')
const candidateRouter = require('./route/candidateRouter')
const otpRouter = require('./route/otpRouter')
const electionRouter = require('./route/electionRouter')
const voteRouter = require('./route/voteRouter')

const connectDB = require('./data/dbConnect')

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:true}));
app.use(cors()); 

app.use('',voterRouter)
app.use('',voteRouter)
app.use('',electionRouter)
app.use('',otpRouter)
app.use('',candidateRouter)

app.get('/',(req,res)=>{
    res.send("Welcome to Voting System backend!")
})

const serverStart = async ()=>{
    try { 
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to Database")
        app.listen(5001,()=>{
            console.log("Server started on 5001")
        })
        
    } catch (error) {
        console.log(error)
    }

}

serverStart()