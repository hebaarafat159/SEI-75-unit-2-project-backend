import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import categoryRouter from './routers/category.js'
import productRouter from './routers/product.js'
import userRouter from './routers/user.js'
import listRouter from './routers/shoppingList.js'

import express, { Router } from "express";
import serverless from "serverless-http";

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());
// app.use("/categories", categoryRouter);
// app.use("/products", productRouter);
// app.use("/users", userRouter);
// app.use("/shoppingLists",listRouter);

// // const port = process.env.PORT || 4000;

// // app.listen(port, ()=>{
// //     console.log(`listening on port: ${port}`);
// // })

// // app.use("/app/", router);

// const router = Router();
// router.get("/hello", (req, res) => res.send("Hello World!"));

// app.use("/app/", router);


// export const handler = serverless(app);

import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

// const router = Router();
// router.get("/hello", (req, res) => res.send("Hello World!"));

import dotenv from "dotenv";
dotenv.config();

// api.use(
//     cors({
//       origin: "https://", // Replace with your client's origin
//       credentials: true, // Enable credentials (cookies) in CORS
//     })
// );

mongoose.connect(`${process.env.DATABASE_URL}`);

// api.use("/api/", router);
api.use(cors());
api.use(bodyParser.json());
api.use("/categories", categoryRouter);
api.use("/products", productRouter);
api.use("/users", userRouter);
api.use("/shoppingLists",listRouter);
export const handler = serverless(api);