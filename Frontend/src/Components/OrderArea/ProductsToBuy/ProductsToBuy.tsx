import { useEffect, useState } from "react";
import "./ProductsToBuy.css";
import ProductCartModel from "../../../Models/ProductCartModel";
import productsService from "../../../Services/ProductsService";
import authService from "../../../Services/AuthService";
import UserModel from "../../../Models/UserModel";
import { productsStore } from "../../../Redux/ProductsState";
import ProductModel from "../../../Models/ProductModel";
import { useLocation, useNavigate } from "react-router-dom";
import { RouteActionType, routeStore } from "../../../Redux/RouteState";
import ProductCardToBuy from "../ProductCardToBuy/productCardToBuy";
import notifyService from "../../../Services/NotifyService";

function ProductsToBuy(): JSX.Element {

    const [allProductsForOrder, setAllProductsForOrder] = useState<ProductCartModel[]>([]);
    const [user, setUser] = useState<UserModel>(null);
    const [totalPrice, setTotalPrice] = useState<number>(null);
    const [allProducts, setAllProducts] = useState<ProductModel[]>([])
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(()=>{

        // save the current route in global state
        routeStore.dispatch({type:RouteActionType.changeRoute, payload: location.pathname})

        // get the user details
        const getUser: UserModel = authService.getUser();

        // check if there is a change of direction and save it in the user details
        if(localStorage.getItem("newCity")){
            const newUser = {...getUser}
            newUser.city = localStorage.getItem("newCity");
            newUser.street = localStorage.getItem("newStreet");
            setUser(newUser)
        } else {
            setUser(getUser);
        }

        // get cart details
        productsService.getAnExistCart(getUser.userId)
            .then(c => {

                // get the products from the cart
                productsService.getAllProductsFromCart(c.cartId)
                    .then(p =>{

                        // set the products for order in the component state 
                        setAllProductsForOrder(p);

                        // set the total price in the component state from global state
                        setTotalPrice(productsStore.getState().totalPriceOfOrder)
                    })
                    .catch(err => {
                        console.log(err);
                        notifyService.error(err);

                        if(err.message === "Request failed with status code 401"){
                            authService.logout();
                            navigate("/home");
                        }
                    });
            }).catch(err =>{
                notifyService.error(err);
                console.log(err);   
            });

        // get all products
        productsService.getAllProducts()
            .then(p => setAllProducts(p))
            .catch(err => {
                notifyService.error(err);
                console.log(err);   
            });

        const unsubscribe = productsStore.subscribe(() =>{
            // set the new list of products for the cart component
            if(productsStore.getState().productsFromCart.length > 0){

                // set the new list from global state
                setAllProductsForOrder(productsStore.getState().productsFromCart);

                // set the new total price from global state
                setTotalPrice(productsStore.getState().totalPriceOfOrder)
            }
            else{
                setAllProductsForOrder([]);
            }

            // stop subscribe when the component destroy 
            return () => unsubscribe();
        })
        
    },[]);

    // function for remove the product from the list
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

    // function for go back to the shopping
    const backToShopping = () => {
        navigate("/products");
    }

    // function for continue to the payment part
    const goToPayment = () => {
        navigate("/payment");
    }
    
    // handle the click to change the address
    const handleChangeAddressClick = () => {
        navigate("/changeAddress");
    }

    return (
        <div className="ProductsToBuy">
            {user && <h3> {user.firstName}, it's your last chance for change your order... </h3>}
			<table>
                <thead>
                    <tr>
                        <td>Product Name</td>
                        <td>Quantity</td>
                        <td>Total Price</td>
                        <td>Remove</td>
                    </tr>
                </thead>
                 <tbody>
                    {allProductsForOrder.map(p =>
                        <ProductCardToBuy key={p.productCartId} productCart={p} allProducts={allProducts} handleRemoveProduct={handleRemoveProduct}/>             
                    )}
                </tbody>
            </table>
            <br/>
            <div>
                <span> Total Price: {totalPrice} </span>
            </div>
            <div className="Box">
                <h3>Direction For Delivery</h3>
                {user && <>
                    <span><b>City:</b> {user.city}</span>
                    <br/>
                    <span><b>Street:</b> {user.street}</span>
                    <br/>
                    <br/>
                    <button onClick={handleChangeAddressClick}>Change the address</button>
                </>}
            </div>
            <div>
                <button onClick={backToShopping}>Back To Shopping</button>
                <button onClick={goToPayment}>Go To Payment</button>
            </div>
        </div>
    );
}

export default ProductsToBuy;
