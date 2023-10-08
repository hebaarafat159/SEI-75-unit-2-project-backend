import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import categoryRouter from './routers/category.js'
import productRouter from './routers/product.js'
import userRouter from './routers/user.js'

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`listening on port: ${port}`);
})