import express from "express";
import {
    createProduct,
    // updateProductStocks,
    updateProduct,
    deleteProduct,
    ProductsList,
    allProductsGroupWise,
    getProductById,
    getProductCategoryWise,
    fetchCategories,
    filterProducts
} from "../controllers/product.controller.js";
import { body } from "express-validator";
import auth from "../middlewares/auth.middleware.js";
import upload from "../lib/multer.js";
const productRouter = express.Router();

productRouter.post('/add-product', auth, upload.single('image'), createProduct)
productRouter.get('/product-list', auth, ProductsList)
productRouter.get('/product-group-wise', auth, allProductsGroupWise)
// productRouter.patch('/update-product-stock/:id', auth, updateProductStocks)
productRouter.put('/update-product/:id', auth, upload.single('image'), updateProduct)
productRouter.get('/get-product/:id', auth, getProductById)
productRouter.delete('/delete-product/:id', auth, deleteProduct)
productRouter.get('/get-category-product/:category', auth, getProductCategoryWise)
productRouter.get('/categories', auth, fetchCategories)
productRouter.get('/filter-product', auth, filterProducts) //  values should be comes into query



// [
//     body('name').isEmpty().withMessage('Product name is required'),
//     body('price').isEmpty().withMessage('Product price is required'),
//     body('description').isEmpty().isLength({ min: 10 }).withMessage('Product description is required and should be at least 10 characters long'),
// ]
export default productRouter;