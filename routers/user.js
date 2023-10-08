import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from 'node-fetch';

let userRouter = express.Router();

// return all products list for a category
userRouter.get('/',async (req,res)=>{
    console.log("User Router");
    res.json({
        message: "User Router"
    })
    res.end();
})

export default userRouter;
