import { useEffect, useState } from "react";
import "./Payment.css";
import UserModel from "../../../Models/UserModel";
import ProductCartModel from "../../../Models/ProductCartModel";
import ProductModel from "../../../Models/ProductModel";
import authService from "../../../Services/AuthService";
import productsService from "../../../Services/ProductsService";
import { ProductsActionType, productsStore } from "../../../Redux/ProductsState";
import { useForm } from "react-hook-form";
import CreditCardModel from "../../../Models/CreditCardModel";
import MyPdfDocument from "../CreatePDFRecipe/CreatePDFRecipe";
import { useLocation, useNavigate } from "react-router-dom";
import { RouteActionType, routeStore } from "../../../Redux/RouteState";
import OrderModel from "../../../Models/OrderModel";
import notifyService from "../../../Services/NotifyService";

function Payment(): JSX.Element {
    
    const [user, setUser] = useState<UserModel>(null);
    const [productsToBuy, setProductsToBuy] = useState<ProductCartModel[]>([]);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const {register, handleSubmit, formState} = useForm<CreditCardModel>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{

        // save the route in global state
        routeStore.dispatch({type:RouteActionType.changeRoute, payload: location.pathname});

        // get the user and set it in the component state
        const userFromService = authService.getUser();

        if(!userFromService){
            navigate("/home")
        }

        // check if there is a change of direction and save it in the user details
        if(localStorage.getItem("newCity")){
            const newUser = {...userFromService}
            newUser.city = localStorage.getItem("newCity");
            newUser.street = localStorage.getItem("newStreet");
            setUser(newUser)
        } else {
            setUser(userFromService);
        }

        // get the cartID
        productsService.getAnExistCart(userFromService.userId)
            .then(c => {
                // get the products from cart to buy
                productsService.getAllProductsFromCart(c.cartId)
                    .then(p => setProductsToBuy(p))
                    .catch(err => {
                        notifyService.error(err);
                        console.log(err);   
                    });
            }).catch(err => {
                notifyService.error(err);
                console.log(err);   
            });
        
        // get all the products
        productsService.getAllProducts()
            .then(p => setProducts(p))
            .catch(err => {
                notifyService.error(err);
                console.log(err);   
            });
        
        // get the total price
        const totalPriceFromRedux = productsStore.getState().totalPriceOfOrder;

        // if the user refresh the page, the total price from redux start with 0 and we need to subscribe to changes in the global state 
        if(totalPriceFromRedux === 0) {
            const unsubscribe = productsStore.subscribe(() =>{
                setTotalPrice(productsStore.getState().totalPriceOfOrder);
            });

            return () => unsubscribe();
        }

        setTotalPrice(totalPriceFromRedux);

    },[]);

    // send the payment
    function send(payment: CreditCardModel): void {

        const date = new Date();
        const date2 = new Date(1478708162000)

        const order = new OrderModel(productsToBuy[0].cartId, user.userId, productsToBuy, user.city, user.street, date, date2, payment.creditCard);

        // send the order to backend
        productsService.sendNewOrder(order).catch(err =>{
            notifyService.error(err);
            console.log(err);   
        });

        // clean the localStorage
        localStorage.removeItem("newCity");
        localStorage.removeItem("newStreet");

        // clean the redux
        productsStore.dispatch({type: ProductsActionType.newOrder});

        // navigate to the ordered page
        navigate("/ordered");
    }

    return (
        <div className="Payment">
            <div className="ProductsFromCartToBuy">
                <h3>Product List</h3>
                <table>
                    <thead>
                        <tr>
                            <td>Product Name</td>
                            <td>Quantity</td>
                            <td>Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {productsToBuy.length !== 0 && productsToBuy.map(oneProduct => 
                            <tr key={oneProduct.productCartId}>
                                <td>
                                    {products.find(p => p.productId === oneProduct.productId).productName}
                                </td>
                                <td>{oneProduct.quantity}</td>
                                <td>{oneProduct.totalPrice}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <p>
                    <span>Total Price: {totalPrice} |  </span>
                    <span>Total Products: {productsToBuy.length} </span>
                </p>
                <hr/>
                <h3>Order Details</h3>
                    {user && <>
                        <span><b>Name: </b>{user.firstName} {user.lastName}</span>
                        <br/><br/>
                        <span><b>Address: </b>{user.street},  {user.city}</span>
                        <br/><br/>
                        <span><b>Email: </b>{user.email}</span>
                        <br/>
                    </>}
            </div>
            <div className="UserDetails">

                <div>
                    <h3>Payment</h3>
                    <form onSubmit={handleSubmit(send)}>
                        <label>owner's creditCard ID</label>
                        <input type="number" {...register("ID", CreditCardModel.validation.ID)}/>
                        {formState.errors.ID && <>
                            <br/>
                            <span>{formState.errors.ID?.message}</span>
                            <br/>
                        </>}
                        
                        <label>CreditCard</label>
                        <input type="number" {...register("creditCard", CreditCardModel.validation.creditCard)}/>
                        {formState.errors.creditCard && <>
                            <br/>
                            <span>{formState.errors.creditCard?.message}</span>
                            <br/>
                        </>}

                        <label>validity</label>
                        <input type="month" {...register("validity", CreditCardModel.validation.validity)}/>
                        {formState.errors.validity && <>
                            <br/>
                            <span>{formState.errors.validity?.message}</span>
                            <br/>
                        </>}

                        <label>CVV</label>
                        <input type="number" {...register("cvv", CreditCardModel.validation.cvv)}/>
                        {formState.errors.cvv && <>
                            <br/>
                            <span>{formState.errors.cvv?.message}</span>
                            <br/>
                        </>}

                        {!formState.isValid && <button disabled>Pay Now</button>}
                        {formState.isValid && <button >Pay Now</button>}
                    </form>

                {/* <MyPdfDocument productsListToBuy={productsToBuy} totalPrice={totalPrice} user={user} paymentDetails={paymentDetails} allProducts={products}/> */}
                </div>
            </div>
        </div>
    );
}

export default Payment;
