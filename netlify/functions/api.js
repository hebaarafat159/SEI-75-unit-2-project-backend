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

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

// api.use(
//     cors({
//       origin: "https://https://startling-mochi-356199.netlify.app/", // Replace with your client's origin
//       credentials: true, // Enable credentials (cookies) in CORS
//     })
// );

// mongoose.connect(`${process.env.DATABASE_URL}`);

api.use(cors());
api.use(bodyParser.json());
api.use("/api/", router);
api.use("/categories", categoryRouter);
api.use("/products", productRouter);
api.use("/users", userRouter);
api.use("/shoppingLists",listRouter);

export const handler = serverless(api);