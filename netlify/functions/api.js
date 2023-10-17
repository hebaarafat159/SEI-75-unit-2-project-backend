import express, { Router } from "express";
import serverless from "serverless-http";

import categoryRouter from '../../routers/category.js'
import productRouter from '../../routers/product.js'
import userRouter from '../../routers/user.js'
import listRouter from '../../routers/shoppingList.js'

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", router);
api.use("/api/categories", categoryRouter);
api.use("/api/products", productRouter);
api.use("/api/users", userRouter);
api.use("/api/shoppingLists",listRouter);

export const handler = serverless(api);