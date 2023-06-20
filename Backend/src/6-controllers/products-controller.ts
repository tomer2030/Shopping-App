import express, { Request, Response, NextFunction } from "express";
import productsLogic from "../5-logic/products-logic";
import path from "path"
import ProductCartModel from "../4-models/product-cart-model";
import { ValidationErrorModel } from "../4-models/error-models";
import ProductModel from "../4-models/product-model";
import OrderModel from "../4-models/order-model";
import verifyAdmin from "../3-middleware/verify-admin";
import authService from "../2-utils/auth-service";
import UserModel from "../4-models/user-model";
import verifyLoggedIn from "../3-middleware/verify-logged-in";

const router = express.Router(); // Capital R

// get all products -> GET http://localhost:3001/api/products
router.get("/products", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const products = await productsLogic.getAllProducts();
        response.json(products);
    }
    catch (err: any) {
        next(err);
    }
});

// get one product -> GET http://localhost:3001/api/products/:productId
router.get("/products/:productId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // get the product ID from the request
        const productId = +request.params.productId;
        const product = await productsLogic.getOneProduct(productId);
        response.json(product);
    }
    catch (err: any) {
        next(err);
    }
});

// get product image -> GET http://localhost:3001/api/products/img/:4f1ab560-7d5a-4309-9360-8d14b7974a72.jpg
router.get("/products/img/:imageName",  async (request: Request, response: Response, next: NextFunction) => {
    try {
        // get the image name from request
        const imageName = request.params.imageName;        
        
        // make an absolute path
        const absolutePath = path.join(__dirname, "..",  "1-assets", "images", imageName);

        // send the image
        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err);
    }
});

// get all categories -> GET http://localhost:3001/api/categories
router.get("/categories", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const categories = await productsLogic.getAllCategories();
        response.json(categories);
    }
    catch (err: any) {
        next(err);
    }
});

// get products by category -> GET http://localhost:3001/api/products/products-by-category/:categoryId
router.get("/products/products-by-category/:categoryId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // get category id from request
        const categoryId = +request.params.categoryId;
        const productsByCategory = await productsLogic.getProductByCategory(categoryId);
        response.json(productsByCategory);
    }
    catch (err: any) {
        next(err);
    }
});

// create new cart -> POST http://localhost:3001/api/cart
router.post("/cart", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // rescue user from the request
        const user = new UserModel(await authService.rescueUserFromToken(request));

        // get the new cart 
        const newCart = await productsLogic.createNewCart(user.userId);
        
        // validate the cart
        const errors = newCart.validate();
        if(errors) throw new ValidationErrorModel(errors);

        // return the new cart
        response.status(201).json(newCart);
    }
    catch (err: any) {
        next(err);
    }
});

// remove cart -> DELETE http://localhost:3001/api/cart/:cartId
router.delete("/cart/:cartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // rescue cart id from the request
        const cartId = +request.params.cartId

        // remove the cart 
        await productsLogic.removeCart(cartId);
        
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// get en exist cart -> GET http://localhost:3001/api/cart/:userId
router.get("/cart/:userId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // rescue cart id from the request
        const userId = +request.params.userId;

        // get the cart 
        const cart = await productsLogic.getAnExistCart(userId);
        
        // return the cart
        response.json(cart);
    }
    catch (err: any) {
        next(err);
    }
});

// get all products from same cart -> GET http://localhost:3001/api/cart/products/:cartId
router.get("/cart/products/:cartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // rescue cart id from the request
        const cartId = +request.params.cartId;

        // get the cart 
        const products = await productsLogic.getAllProductsFromCart(cartId);
        
        // return the cart
        response.json(products);
    }
    catch (err: any) {
        next(err);
    }
});

// add product to cart -> POST http://localhost:3001/api/cart/products
router.post("/cart/products", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // get product from request
        const productToCart = new ProductCartModel(request.body);

        // get the product for calculate the total price
        const product = await productsLogic.getOneProduct(productToCart.productId);
        productToCart.totalPrice = productToCart.quantity * product.price;

        // validation
        const errors = productToCart.validate();
        if(errors) throw new ValidationErrorModel(errors);

        // add product to cart
        const addedProductToCart = await productsLogic.addProductToCart(productToCart);

        // return the added product
        response.status(201).json(addedProductToCart);
    }
    catch (err: any) {
        next(err);
    }
});

// get one product from cart
router.get("/cart/products/:productCartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // get the productCart id from the request
        const productCartId = +request.params.productCartId;

        // get the product from DB 
        const productCart = await productsLogic.getOneProductFromCart(productCartId);

        response.json(productCart);
    }
    catch (err: any) {
        next(err);
    }
});

// remove product from cart -> DELETE http://localhost:3001/api/cart/products
router.delete("/cart/products/:productCartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // get productCart id from request
        const productCartId = +request.params.productCartId;

        // remove product from cart
        await productsLogic.removeProductFromCart(productCartId);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

// update number of products in cart -> PUT http://localhost:3001/api/cart/products/:productCartId
router.put("/cart/products/:productCartId", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // get quantity from request
        const quantity = +request.body.quantity;
        
        // get product id from request
        const productId = +request.body.productId;     

        // get the product cart id from route 
        const productCartId = +request.params.productCartId;

        // validation

        // if less than 0, return error
        if(quantity < 0) throw new ValidationErrorModel("the number can't be less than 0");

        // if 0, remove the product from cart
        else if (quantity === 0){
            await productsLogic.removeProductFromCart(productCartId);
            response.sendStatus(204);
        }

        else {
            // send the update
            const updatedProductInCart = await productsLogic.updateQuantityOfProductInCart(productId, quantity, productCartId);
    
            // return the updated product
            response.json(updatedProductInCart);
        }
    }
    catch (err: any) {
        next(err);
    }
});

// add new product to list -> POST http://localhost:3001/api/products
router.post("/products", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Take uploaded file, set it to the body:
        request.body.image = request.files?.image;

        // get product from request
        const product = new ProductModel(request.body);

        // send the new product
        const addedProduct = await productsLogic.addProductToList(product);

        // return the added product
        response.status(201).json(addedProduct);
    }
    catch (err: any) {
        next(err);
    }
});


// update product in list -> PUT http://localhost:3001/api/products/product-to-cart/:productCartId
router.put("/products/:productId", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // Take uploaded file, set it to the body:
        request.body.image = request.files?.image;

        // get product from request
        const product = new ProductModel(request.body);

        // get the product id and add to the product object
        const productId = +request.params.productId;
        product.productId = productId;

        // validation
        const errors = product.validate();
        if(errors) throw new ValidationErrorModel(errors);

        // send the update
        const updatedProduct = await productsLogic.updateProductInList(product);

        // return the updated product
        response.json(updatedProduct);
    }
    catch (err: any) {
        next(err);
    }
});

// send new order -> POST http://localhost:3001/api/orders
router.post("/orders", verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {

        // get the order from request
        const order = new OrderModel(request.body);

        // send the new order
        const addedOrder = await productsLogic.sendNewOrder(order);
        
        // validation
        const errors = addedOrder.validate();
        if(errors) throw new ValidationErrorModel(errors);

        // return the new order
        response.status(201).json(addedOrder);
    }
    catch (err: any) {
        next(err);
    }
});

// get the number of orders -> GET http://localhost:3001/api/orders
router.get("/orders", async (request: Request, response: Response, next: NextFunction) => {
    try {

        // get the count of orders 
        const countOfOrders = await productsLogic.getNumOfOrders();
        
        // return the count
        response.json(countOfOrders);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;