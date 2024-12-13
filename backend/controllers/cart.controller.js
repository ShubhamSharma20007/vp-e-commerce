import CartModel from "../models/cart.model.js"
import ProductModel from "../models/product.model.js"
const createCartProduct = async (req, res) => {
    const { productId } = req.body;
    const { _id: userId } = req.user;

    try {
        // Check if the product exists in the database
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Check if the user already has a cart
        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            // Create a new cart for the user
            if (product.stockes < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock",
                });
            }

            cart = await CartModel.create({
                userId,
                products: [{
                    productId: productId,
                    quantity: 1,
                },],
            });

            product.stockes -= 1;
            await product.save();

            return res.status(200).json({
                success: true,
                message: "Product added to cart",
                cart,
            });
        }

        // Check if the product already exists in the cart
        const productInCart = cart.products.find(
            (item) => item.productId.toString() === productId.toString()
        );

        if (productInCart) {
            // Update quantity if product exists
            if (product.stockes < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock",
                });
            }

            productInCart.quantity += 1;
        } else {
            // Add new product to cart if it doesn't exist
            if (product.stockes < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock",
                });
            }

            cart.products.push({
                productId: productId,
                quantity: 1,
            });
        }

        // Save changes to cart and update product stock
        product.stockes -= 1;
        await product.save();
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


//  POST : get the product from the cart

const getProductCart = async (req, res) => {
    const userId = req.user._id;

    try {
        const userCartExisting = await CartModel.findOne({ userId: userId }).populate("products.productId");

        return res.status(200).json({
            success: true,
            message: "Cart found",
            cart: userCartExisting
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })

    }
}

//  GET : cart length 
const cartLength = async (req, res) => {
    const userId = req.user._id;
    try {
        const cartLength = await CartModel.findOne({ userId: userId });
        if (!cartLength) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Cart found",
            cartLength: cartLength.products.length
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}

//  DELETE : delete product from cart
const deleteProductCart = async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.id;
    const quantity = req.params.qty;

    try {
        const cart = await CartModel.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        const productIndex = cart.products.findIndex(product => product.productId == productId);
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })
        }
        cart.products.splice(productIndex, 1)
        await cart.save();

        // update product stock
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        product.stockes += parseInt(quantity);
        await product.save();
        return res.status(200).json({
            success: true,
            message: "Product deleted from cart",
            data: cart
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })

    }
}


// PUT : update the  quantity in cart modal and check the stockes is available or not in product modal
const updateProductCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        // Find the user's cart
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Find the product in the cart
        const productInCart = cart.products.find(
            (item) => item.productId.toString() === productId.toString()
        );
        if (!productInCart) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        // Check stock availability for positive quantity changes
        if (quantity > 0 && product.stockes < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock available",
            });
        }

        // Update stock and cart quantities
        productInCart.quantity += quantity;

        if (productInCart.quantity <= 0) {
            cart.products = cart.products.filter(
                (item) => item.productId.toString() !== productId.toString()
            );
        }

        product.stockes -= quantity;

        if (product.stockes < 0) {
            product.stockes = 0;
        }


        await cart.save();
        await product.save();


        const updatedStockProduct = await ProductModel.findById(productId);

        return res.status(200).json({
            success: true,
            message: "Product quantity updated in cart successfully",
            updatedStockProduct,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};


export {
    createCartProduct,
    getProductCart,
    cartLength,
    deleteProductCart,
    updateProductCart
}