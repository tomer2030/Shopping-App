import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsStore } from "../../../Redux/ProductsState";
import productsService from "../../../Services/ProductsService";
import "./NewCart.css";
import notifyService from "../../../Services/NotifyService";

function NewCart(): JSX.Element {
    
    const navigate = useNavigate();

    useEffect(()=>{

        // get the cart id for remove it from DB
        const cart = productsStore.getState().cart;
        
        // if the old cart exist, remove it
        if(cart) productsService.removeCart(cart.cartId).catch(err => {
            notifyService.error(err);
            console.log(err);   
        });

        // create new cart
        productsService.createNewCart().catch(err => {
            notifyService.error(err);
            console.log(err);   
        });

        // navigate to the products component
        navigate("/products");

    })
    
    
    return null
}

export default NewCart;
