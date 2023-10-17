import express, { Router } from "express";
import serverless from "serverless-http";

import categoryRouter from '../../routers/category.js'


const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", router);
api.use("/api/categories", categoryRouter);

export const handler = serverless(api);