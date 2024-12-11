import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.js';
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import { fileURLToPath } from 'url';
import path from 'path';
const app = express();
const dirname = fileURLToPath(
    import.meta.url)


connectDB()
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// static public path
app.use(express.static(path.join(dirname, "../public")))
//  cors configuration 
app.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN }));


//  routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)


//  Server listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port} ✔`)
})