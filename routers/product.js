import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from 'node-fetch';

let productRouter = express.Router();

// return all products list for a category
productRouter.get('/',async (req,res)=>{
    console.log("Category's Product Router");
    res.json({
        message: "Welcome To Category's Product Router"
    })
    res.end();
})

export default productRouter;
