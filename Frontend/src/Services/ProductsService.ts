import axios from "axios";
import CartModel from "../Models/CartModel";
import CategoryModel from "../Models/CategoryModel";
import OrderModel from "../Models/OrderModel";
import ProductCartModel from "../Models/ProductCartModel";
import ProductModel from "../Models/ProductModel";
import { ProductsActionType, productsStore } from "../Redux/ProductsState";
import appConfig from "../Utils/Config";

class ProductsService {

    // function for fix the format date
    private dateFormat(date: string): string {
        const newFormat = new Date(date).toLocaleDateString();
        return newFormat;
    }

    // get all products
    public async getAllProducts(): Promise<ProductModel[]> {

        // take the products from global state
        let products = productsStore.getState().products;

        // if the global state is empty. get the products from the backend
        if(products.length === 0) {

            // AJAX request
            const response = await axios.get<ProductModel[]>(appConfig.productsUrl);
            products = response.data;

            // save the products in global state
            productsStore.dispatch({type: ProductsActionType.getAllProducts, payload: products});
        }

        return products;
    }

    // get one product
    public async getOneProducts(productId: number): Promise<ProductModel> {

        // take the products from global state
        let products = productsStore.getState().products;
        let product;

        // if the global state is empty. get the products from the backend
        if(products.length === 0) {

            // AJAX request
            const response = await axios.get<ProductModel>(appConfig.productsUrl + productId);
            product = response.data;

            // return the product
            return product;
        }

        // find the product from all the product
        product = products.find(p => p.productId == productId);

        // return the product
        return product;
    }

    // get all categories
    public async getAllCategories(): Promise<CategoryModel[]> {

        // get the categories from global state
        let categories = productsStore.getState().categories;

        // if the global state is empty, get the categories from backend
        if(categories.length === 0) {

            // AJAX request
            const response = await axios.get<CategoryModel[]>(appConfig.categoriesUrl);
            categories = response.data;

        }

        return categories;   
    }

    // filter products by name
    public async filterProductsByName(searchName: string): Promise<ProductModel[]> {

        // get all the products
        const products = await this.getAllProducts();

        // filter the products by name
        const filteredProducts = products.filter(p => p.productName.includes(searchName))

        return filteredProducts;
    }

    // filter products by category
    public async filterProductsByCategory(categoryId: number): Promise<ProductModel[]> {
        
        // AJAX request
        const response = await axios<ProductModel[]>(appConfig.productsByCategoryUrl + categoryId);
        const filteredProducts = response.data;

        return filteredProducts;
    }

    // create new cart
    public async createNewCart(): Promise<CartModel> {
        
        // AJAX request
        const response = await axios.post<CartModel>(appConfig.cartUrl);
        const newCart = response.data;

        // save the cart in redux
        productsStore.dispatch({type: ProductsActionType.startCart, payload: newCart});

        return newCart;
    }

    // remove cart
    public async removeCart(cartId: number): Promise<void> {

        // AJAX request
        await axios.delete<void>(appConfig.cartUrl + cartId);

        // delete from redux
        productsStore.dispatch({type: ProductsActionType.removeCart});
                
        // empty the products in cart from redux
        productsStore.dispatch({type: ProductsActionType.emptyProductsFromCart});
    }

    // get an exist cart
    public async getAnExistCart(userId: number): Promise<CartModel> {

        // get the cart from global state if exist
        if(productsStore.getState().cart){
            return productsStore.getState().cart;
        }
        
        // AJAX request
        const response = await axios.get<CartModel>(appConfig.cartUrl + userId);
        const cart = response.data;

        // if there is a cart
        if(cart) {

            // make a format for the start date
            cart.cartStartDate = this.dateFormat(cart.cartStartDate);

            // save the cart in global state
            productsStore.dispatch({type:ProductsActionType.startCart, payload: cart});
            return cart;
        }

        // if the user not have a cart, return null
        return null

    }

    // get all products from same cart
    public async getAllProductsFromCart(cartId: number): Promise<ProductCartModel[]> {

        // get the data from global state
        let productsFromCart = productsStore.getState().productsFromCart;

        // if not exist in global state
        if(productsFromCart.length === 0) {

            // AJAX request
            const response = await axios.get<ProductCartModel[]>(appConfig.cartProductsUrl + cartId);
            productsFromCart = response.data;

            // save all the products in global state
            productsStore.dispatch({type: ProductsActionType.getAllProductsFromCart, payload: productsFromCart})
        }


        return productsFromCart;
    }

    // add product to cart
    public async addProductToCart(productCart: ProductCartModel): Promise<ProductCartModel> {

        // get all the products in cart and check if the product already exist
        const productsFromCart = await this.getAllProductsFromCart(productCart.cartId);

        // if there are products in the cart
        if(productsFromCart.length !== 0){

            // search fot the index of the product we want to add in the products list 
            const indexOfProduct = productsFromCart.findIndex(p => p.productId === productCart.productId);

            // if  exist, the return index will not be -1 
            if(indexOfProduct !== -1){
                
                // add the index of the product
                productCart.productCartId = productsFromCart[indexOfProduct].productCartId;
                            
                // send to backend the product to update the quantity
                const updatedProduct = await this.updateQuantityInCart(productCart);
                return updatedProduct;
            }
        } 

        // if not exist, send the new product to backend 
        const response = await axios.post<ProductCartModel>(appConfig.cartProductsUrl, productCart);
        const addedProductCart = response.data;
        
        // add to global state
        productsStore.dispatch({type: ProductsActionType.addProductToCart, payload: addedProductCart});

        return addedProductCart;
    }

    // remove product from cart
    public async removeProductFromCart(productCartId: number): Promise<void> {

        // remove from the backend
        await axios.delete<void>(appConfig.cartProductsUrl + productCartId);

        // remove from redux
        productsStore.dispatch({type: ProductsActionType.removeProductFromCart, payload: productCartId});
    }

    // update quantity in cart
    public async updateQuantityInCart(productCart: ProductCartModel): Promise<ProductCartModel>{
        
        // AJAX request
        const response = await axios.put<ProductCartModel>(appConfig.cartProductsUrl + productCart.productCartId, productCart);
        const updateProductCart = response.data;

        // update in the global state
        productsStore.dispatch({type: ProductsActionType.updateQuantityInCart, payload: updateProductCart});

        return updateProductCart;
    }

    // add product to list
    public async addNewProductToList(product: ProductModel): Promise<ProductModel>{

        // AJAX request in formData for images (and files)
        const productFormData = new FormData();
        productFormData.append("productName", product.productName);
        productFormData.append("categoryId", product.categoryId.toString());
        productFormData.append("price", product.price.toString());
        productFormData.append("image", product.image[0]);

        const response = await axios.post<ProductModel>(appConfig.productsUrl, productFormData);

        const addedProduct = response.data;

         // change the string numbers to number type
         addedProduct.categoryId = Number(addedProduct.categoryId);
         addedProduct.price = Number(addedProduct.price);

        // add to the global state
        productsStore.dispatch({type: ProductsActionType.addProductToList, payload: addedProduct});

        return addedProduct;
    }

    // update product from list
    public async updateProductFromList(product: ProductModel): Promise<ProductModel>{
        
        // AJAX request in formData for images (and files)
        const productFormData = new FormData();
        productFormData.append("productName", product.productName);
        productFormData.append("categoryId", product.categoryId.toString());
        productFormData.append("price", product.price.toString());
        productFormData.append("image", product.image[0]);            

        const response = await axios.put<ProductModel>(appConfig.productsUrl + product.productId, productFormData);
        const updatedProduct = response.data;

        // change the string numbers to number type
        updatedProduct.categoryId = Number(updatedProduct.categoryId);
        updatedProduct.price = Number(updatedProduct.price);

        // update product in global state
        productsStore.dispatch({type: ProductsActionType.updateProductInList, payload: updatedProduct});

        return updatedProduct;
    }

    // get number of orders
    public async getNumberOfOrders(): Promise<number> {

        // get the number from global state
        let numOfOrders = productsStore.getState().numOfOrders;
        if(!numOfOrders){
            
            // AJAX request
            const response = await axios.get<number>(appConfig.ordersUrl);
            numOfOrders = response.data;

            // save in the global state
            productsStore.dispatch({type: ProductsActionType.getNumOfOrders, payload: numOfOrders});
        }

        return numOfOrders;
    }

    // send new order
    public async sendNewOrder(order: OrderModel): Promise<OrderModel> {

        // send the order to backend
        const response = await axios.post<OrderModel>(appConfig.ordersUrl, order);
        const sendedOrder = response.data;

        // return the sended order
        return sendedOrder;


    }

}

const productsService = new ProductsService();

export default productsService;