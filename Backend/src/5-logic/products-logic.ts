import fs from "fs"
import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import productsSqlQueries from "../2-utils/products-sql-queries";
import CategoryModel from "../4-models/category-model";
import ProductCartModel from "../4-models/product-cart-model";
import ProductModel from "../4-models/product-model";
import CartModel from "../4-models/cart-model";
import OrderModel from "../4-models/order-model";
import { ErrorModel, ResourceNotFoundErrorModel, ValidationErrorModel } from "../4-models/error-models";
import {v4 as uuid} from "uuid"

// get all products from DB
async function getAllProducts(): Promise<ProductModel[]> {

    const products = await dal.execute(productsSqlQueries.getAllProducts);
    return products;

}

// get product by category
async function getProductByCategory(categoryId: number): Promise<ProductModel[]> {
    
    const products = await dal.execute(productsSqlQueries.getProductsByCategory, categoryId);
    return products;

}

// get all categories 
async function getAllCategories(): Promise<CategoryModel[]> {

    const categories = await dal.execute(productsSqlQueries.getAllCategories);
    return categories;

}

// get one product
async function getOneProduct(productId: number): Promise<ProductModel> {

    const products = await dal.execute(productsSqlQueries.getOneProduct, productId);

    // if the product not exist, throw new error
    if(products.length === 0) throw new ResourceNotFoundErrorModel(productId);

    // rescue product from arr 
    const product = products[0];
    return product;

}

// create new cart
async function createNewCart(userId: number): Promise<CartModel> {
    
    // make the an cart object
    const cart = new CartModel();
    
    // make the startDate for the cart
    cart.cartStartDate = new Date()

    // add the userId to cart object
    cart.userId = userId;

    const values = [userId, cart.cartStartDate]
    
    // make new cart in DB
    const info: OkPacket = await dal.execute(productsSqlQueries.startNewCart, values);

    // get the cart id from DB
    cart.cartId = info.insertId;

    // return the data of new cart
    return cart;

}

// remove an cart
async function removeCart(cartId: number): Promise<void> {

    // remove the product from DB
    const info: OkPacket = await dal.execute(productsSqlQueries.removeCart, cartId);

    // throw error if not removed
    if(!info.affectedRows) throw new ErrorModel("there is some problem with removing cart", 400);
}

// get an exist cart
async function getAnExistCart(userId: number): Promise<CartModel> {

    // get the cart from DB
    const carts: CartModel[] = await dal.execute(productsSqlQueries.existCart, userId);

    // check if the cart in not already ordered
    const orderedCarts: CartModel[] = await dal.execute(productsSqlQueries.orderedCart, userId);

    // variable for cart index if there is a cart that not ordered
    let cartIndex: number = -1;

    // a boolean variable for the check if the cart is already ordered - true = is ordered, false = is not ordered
    let cartOrdered: boolean = false;
    for(let i = 0; i < carts.length; i++) {
        for(let j = 0; j < orderedCarts.length; j++) {

            // if the cart (from carts table) exist in the orders table
            if(orderedCarts[j].cartId === carts[i].cartId) {
                
                // change the variable to true and stop the loop
                cartOrdered = true;
                break;
            }
        }
        // if after the intern loop, the cartOrdered is still false, it's mean that the cart is not ordered. we can stop the main loop and save the index 
        if(!cartOrdered) {
            cartIndex = i;
            break;
        }

        // else, reset the cartOrdered to false
        cartOrdered = false;
    }

    // if after all the checks the variable is false, return null
    if(cartIndex === -1) return null

    // rescue the cart
    const cart = carts[cartIndex];

    // return the cart
    return cart;
}

// get all the products from same cart
async function getAllProductsFromCart(cartId: number): Promise<CartModel> {

    // get all the products with same cartId from DB
    const products = await dal.execute(productsSqlQueries.allProductsFromCart, cartId);

    // return the products
    return products;
}

// add product to cart
async function addProductToCart(productCart: ProductCartModel): Promise<ProductCartModel> {

    // get the product for calculate the total price
    const product = await getOneProduct(productCart.productId);
    productCart.totalPrice = productCart.quantity * product.price;
    
    // check if there is already this product in the cart
    if(productCart.productCartId) {

        // get the product from the cart
        const productInCart = await this.getOneProductFromCart(productCart.productCartId);
        
        // if there is a product
        if(productInCart) {

            // update the quantity
            productCart.quantity = productCart.quantity +  productInCart.quantity;
            
            // return the updated product
            return this.updateQuantityOfProductInCart(productCart.productId, productCart.quantity, productCart.productCartId);
        }
    }

    const values = [productCart.productId, productCart.quantity, productCart.totalPrice, productCart.cartId];

    // get the addedProduct
    const info: OkPacket = await dal.execute(productsSqlQueries.addProductToCart, values);

    // generate the productCartId
    productCart.productCartId = info.insertId;

    // return the added product cart
    return productCart;

}

// remove product from cart
async function removeProductFromCart(productCartId: number): Promise<void> {

    // remove the product from DB
    const info: OkPacket = await dal.execute(productsSqlQueries.removeProductFromCart, productCartId);

    // throw error if not deleted
    if(!info.affectedRows) throw new ErrorModel("there is some problem with removing product", 400);

}

// get one product from cart
async function getOneProductFromCart(productCartId: number): Promise<ProductCartModel>{
    const productCart = await dal.execute(productsSqlQueries.getOneProductCart, productCartId);
    return productCart[0];
}

// update quantity of product in cart
async function updateQuantityOfProductInCart(productId: number ,quantity: number, productCartId: number): Promise<ProductCartModel> {

    // get the product for calculate the total price
    const product = await getOneProduct(productId);
    const totalPrice = quantity * product.price;   

    const values = [quantity, totalPrice, productCartId];
        
    // update the quantity
    const info: OkPacket = await dal.execute(productsSqlQueries.updateQuantityOfProductInCart, values);
    
    // throw error if not affected
    if(info.affectedRows === 0) throw new ErrorModel("there is some problem with updated", 400);

    // get the updated product
    const updatedProductCart = await getOneProductFromCart(productCartId);

    // return the added product cart
    return updatedProductCart;
}

// add new product to list
async function addProductToList(product: ProductModel): Promise<ProductModel> {

    // save the image in disk if exist
    if(product.image){

        // get the extension
        const extension = product.image.name.substring(product.image.name.lastIndexOf("."));

        // unique name for the image
        product.imageName = uuid() + extension;

        // save the image in the disk
        await product.image.mv("./src/1-assets/images/" + product.imageName);
        delete product.image;
    }

    // validate
    const errors = product.validate();
    if(errors) throw new ValidationErrorModel(errors);

    const values = [product.productName, product.categoryId, product.price, product.imageName]
        
    // add the product to db
    const info: OkPacket = await dal.execute(productsSqlQueries.addProductToList, values);
    
    // throw error if not added
    if(!info.affectedRows) throw new ErrorModel("there is some problem", 400);

    // generate the ID
    product.productId = info.insertId;

    // return the added product 
    return product;
}

// update product in list
async function updateProductInList(product: ProductModel): Promise<ProductModel> {

    // validate
    const errors = product.validate();
    if(errors) throw new ValidationErrorModel(errors);

            
    // get the old product from DB
    const productDB: ProductModel = await getOneProduct(product.productId);

    // take the old image name
    product.imageName = productDB.imageName;

    // save the image in disk if exist
    if(product.image){

        // delete the old image from disk
        if(product.imageName) {
    
            // delete it:
            fs.unlinkSync("./src/1-assets/images/" + product.imageName);
        }

        // get the extension
        const extension = product.image.name.substring(product.image.name.lastIndexOf("."));

        // change the image name in the object to new unique name
        product.imageName = uuid() + extension;

        // save the new image in the disk
        await product.image.mv("./src/1-assets/images/" + product.imageName);
        delete product.image;

    }

    const values = [product.productName, product.categoryId, product.price, product.imageName, product.productId];
        
    // update the product in db
    const info: OkPacket = await dal.execute(productsSqlQueries.updateProductInList, values);
    
    // throw error if not added
    if(!info.affectedRows) throw new ErrorModel("there is some problem", 400);

    // return the added product 
    return product;
}

// send new order
async function sendNewOrder(order: OrderModel): Promise<OrderModel> {

    // make the order date
    order.orderDate = new Date();

    const values = [order.cartId, order.userId, order.finalPrice, order.deliveryCity, order.deliveryStreet, order.deliveryDate, order.orderDate, order.creditCard];
    
    const info: OkPacket = await dal.execute(productsSqlQueries.sendNewOrder, values);

    // throw error if not added
    if(!info.affectedRows) throw new ErrorModel("there is some problem", 400);

    // generate the ID
    order.orderId = info.insertId;

    // return the sended order
    return order;
}

// get number of orders
async function getNumOfOrders(): Promise<number> {
    const numOfOrders = await dal.execute(productsSqlQueries.numberOfOrders);
    return numOfOrders.length;
}

export default {
    getAllProducts, getProductByCategory, getAllCategories, getOneProduct, createNewCart, addProductToCart, removeProductFromCart, updateQuantityOfProductInCart, addProductToList, updateProductInList, sendNewOrder, getNumOfOrders, removeCart, getAnExistCart, getAllProductsFromCart, getOneProductFromCart
}
