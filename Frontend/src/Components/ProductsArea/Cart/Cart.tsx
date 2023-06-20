import { useEffect, useState } from "react";
import ProductCartModel from "../../../Models/ProductCartModel";
import ProductModel from "../../../Models/ProductModel";
import { productsStore } from "../../../Redux/ProductsState";
import productsService from "../../../Services/ProductsService";
import "./Cart.css";
import { NavLink } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";

interface CartProps {
	products: ProductModel[];
    cartId: number;
}

function Cart(props: CartProps): JSX.Element {

    const [productsCart, setProductsCart] = useState<ProductCartModel[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(()=>{

        productsService.getAllProductsFromCart(props.cartId)
            .then(p => {

                // set the product in the component state
                setProductsCart(p);
                
                // set the total price in the component state
                setTotalPrice(productsStore.getState().totalPriceOfOrder);
            }).catch(err => {
                notifyService.error(err);
                console.log(err);   
            });
                    

        // define unsubscribe for stop the subscribing when the component will destroy
        const unsubscribe = productsStore.subscribe(()=>{

            // set the new list of products for the cart component
            if(productsStore.getState().productsFromCart.length > 0){
                setProductsCart(productsStore.getState().productsFromCart)
            }
            else{
                setProductsCart([]);
                unsubscribe()
            }

        });

        // stop subscribe when the component destroy 
        return () => unsubscribe();

    },[]);

    // function for update the quantity
    const handleUpdateQuantity = (productCartId: number, quantityToUpdate: number) => {
        
        // get the product
        const productToUpdate = productsCart.find(p => p.productCartId === productCartId);

        // if the quantity is'nt 0
        if(quantityToUpdate > 0){
            
            // put the new quantity in the product object
            productToUpdate.quantity = quantityToUpdate;
            
            // change the quantity in the cart's list
            productsService.updateQuantityInCart(productToUpdate)
                .then(updatedProduct => {
                    const newProductsCart = productsCart.map(p => p.productCartId === updatedProduct.productCartId ? updatedProduct : p);
                    setProductsCart(newProductsCart);

                    // get the new total price
                    setTotalPrice(productsStore.getState().totalPriceOfOrder)
                })
                .catch(err => {
                    notifyService.error(err);
                    console.log(err);   
                });
        }

        // if the quantity is 0 
        else {

            // remove the product and get the new total price for the order
            productsService.removeProductFromCart(productCartId)
                .then(() => {
                    setTotalPrice(productsStore.getState().totalPriceOfOrder)   
                })
                .catch(err => {
                    notifyService.error(err);
                    console.log(err);   
                });
        }

    }

    const handleRemoveProduct = (productCartId: number) => {

        productsService.removeProductFromCart(productCartId)
            .then(() => {
                setTotalPrice(productsStore.getState().totalPriceOfOrder)
            })
            .catch(err => {
                notifyService.error(err);
                console.log(err);   
            })
    }

    return (
        <div className="Cart">
            <h2>Cart</h2>
               {productsCart.length > 0 && <>
               <table>
                    <thead>
                        <tr>
                            <td>Product</td>
                            <td>Quantity</td>
                            <td>Total Price</td>
                            <td>Remove</td>
                        </tr>
                    </thead>
                    <tbody>
                        {productsCart.map(oneProductInCart => 
                            <tr key={oneProductInCart.productCartId}>
                                <td key={oneProductInCart.productId}>{props.products.length !== 0 && props.products.find(product => product.productId === oneProductInCart.productId).productName}</td>
                                <td>
                                    <button onClick={() => handleUpdateQuantity(oneProductInCart.productCartId, oneProductInCart.quantity+1)}>➕</button>
                                    {oneProductInCart.quantity}
                                    <button onClick={() => {handleUpdateQuantity(oneProductInCart.productCartId, oneProductInCart.quantity-1)}}>➖</button>
                                </td>
                                <td>{oneProductInCart.totalPrice}</td>
                                <td><button onClick={() => handleRemoveProduct(oneProductInCart.productCartId)}>❌</button></td>
                            </tr> 
                        )}
                    </tbody>
                </table>
                <hr></hr>
            <p>Total Price: {totalPrice} ➡️ <span><NavLink to="/productsToBuy">Checkout</NavLink></span></p>
            
            </> || <>
                <p>The cart is empty</p>
            </>}
        </div>
    );
}

export default Cart;
