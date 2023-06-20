// global state for products

import { createStore } from "redux";
import CartModel from "../Models/CartModel";
import CategoryModel from "../Models/CategoryModel";
import ProductCartModel from "../Models/ProductCartModel";
import ProductModel from "../Models/ProductModel";

// the kind of global state
export class ProductsState {
    public products: ProductModel[] = [];
    public productsFromCart: ProductCartModel[] = [];
    public cart: CartModel = null;
    public categories: CategoryModel[] = [];
    public totalPriceOfOrder: number = 0;
    public numOfOrders: number;
}

export enum ProductsActionType {
    getAllProducts,
    addProductToList,
    updateProductInList,
    getAnExistCart,
    addProductToCart,
    getAllProductsFromCart,
    removeProductFromCart,
    emptyProductsFromCart,
    updateQuantityInCart,
    getAllCategories,
    getNumOfOrders,
    newOrder,
    startCart,
    removeCart,
    saveFinalPrice
}

// A single object which dispatch sends to Redux for some change
export interface ProductsAction {
    type: ProductsActionType; // what type of action
    payload?: any | any[]; // the transform data
}

export function productsReducer(currentState = new ProductsState(), action: ProductsAction): ProductsState {

    // duplicate the current state
    const newState = {...currentState};

    // create an action for any option
    switch(action.type) {

        // get all products
        case ProductsActionType.getAllProducts:
            newState.products = action.payload;
            break;
 
        // add new product
        case ProductsActionType.addProductToList:
            newState.products.push(action.payload);            
            break;
 
        // update product in list
        case ProductsActionType.updateProductInList:
            const indexToUpdate = newState.products.findIndex(p => p.productId === action.payload.productId);
            if(indexToUpdate >= 0) {
                newState.products[indexToUpdate] = action.payload;
            }
            break;
 
        // get products from cart 
        case ProductsActionType.getAnExistCart:
            newState.productsFromCart = action.payload;
            break;
        
        // add product to cart 
        case ProductsActionType.addProductToCart:
            newState.productsFromCart.push(action.payload);            
            newState.totalPriceOfOrder += action.payload.totalPrice;
            break;

        // get all products from cart
        case ProductsActionType.getAllProductsFromCart:
            newState.productsFromCart = action.payload;
            if(newState.totalPriceOfOrder === 0){
                for(let i = 0; i < action.payload.length; i++){
                    newState.totalPriceOfOrder += action.payload[i].totalPrice
                }
            }
            
            break;

        // remove product from cart
        case ProductsActionType.removeProductFromCart:
            const totalPriceToDiscount = newState.productsFromCart.find(p => p.productCartId === action.payload).totalPrice
            newState.productsFromCart = newState.productsFromCart.filter(p => p.productCartId !== action.payload);
            newState.totalPriceOfOrder -= totalPriceToDiscount
            break;

        // update quantity in cart
        case ProductsActionType.updateQuantityInCart:
            const indexToUpdateQuantity = newState.productsFromCart.findIndex(p => p.productCartId === action.payload.productCartId);

            // if there is an index
            if(action.payload.quantity > 0) {
                
                // if the new total price bigger then old total price, discount the difference from total price
                if(action.payload.totalPrice > newState.productsFromCart[indexToUpdateQuantity].totalPrice) {
                    newState.totalPriceOfOrder -= (newState.productsFromCart[indexToUpdateQuantity].totalPrice - action.payload.totalPrice);
                }

                // if the new total price smaller then old total price, add the difference to total price
                else if(action.payload.totalPrice < newState.productsFromCart[indexToUpdateQuantity].totalPrice) {
                    newState.totalPriceOfOrder += (action.payload.totalPrice - newState.productsFromCart[indexToUpdateQuantity].totalPrice);
                } 
                newState.productsFromCart[indexToUpdateQuantity] = action.payload;
                
            }
            else {               
                newState.productsFromCart = newState.productsFromCart.filter(p => p.productCartId !== action.payload);

                // // discount the old product price from total price
                newState.totalPriceOfOrder -= totalPriceToDiscount
            }
            break;
        
        // empty the cart from products
        case ProductsActionType.emptyProductsFromCart:
            newState.productsFromCart = [];
            newState.totalPriceOfOrder = 0;
            break;

        // get all categories
        case ProductsActionType.getAllCategories:
            newState.categories = action.payload;
            break;

        // get the number of orders
        case ProductsActionType.getNumOfOrders:
            newState.numOfOrders = action.payload;
            break;

        // make new order
        case ProductsActionType.newOrder:
            newState.numOfOrders++;
            newState.cart = null;
            newState.productsFromCart = [];
            newState.totalPriceOfOrder = 0;
            break;

        // remove a cart
        case ProductsActionType.removeCart:
            newState.cart = null;
            newState.productsFromCart = [];
            newState.totalPriceOfOrder = 0;
            break;

        // create new cart
        case ProductsActionType.startCart:
            newState.cart = action.payload;
            newState.totalPriceOfOrder = 0;
            newState.productsFromCart = [];     
            break;

    }

    // return the new state after manipulation
    return newState;
}

export const productsStore = createStore(productsReducer);