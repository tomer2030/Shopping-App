import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CartModel from "../../../Models/CartModel";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import productsService from "../../../Services/ProductsService";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import "./Home.css";
import notifyService from "../../../Services/NotifyService";

function Home(): JSX.Element {

    const [user, setUser] = useState<UserModel>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [cart, setCart] = useState<CartModel>(null);
    const [numOfOrders, setNumOfOrders] = useState<number>(null);
    const navigate = useNavigate();

    useEffect(()=>{

        let userFromService = authService.getUser();

        if(Array.isArray(userFromService)){
            userFromService = userFromService[0];
        }

        if(userFromService){
            
            // get the user from the local storage
            setUser(userFromService);
            setIsAdmin(userFromService.roleId === 1);
    
            // get the cart details if there is any
            productsService.getAnExistCart(userFromService.userId)
                .then(c => setCart(c))
                .catch(err => {
    
                    // print the error message
                    console.log(err);
                    notifyService.error(err);
    
                    // if the error is an unauthorized request, log out the user and render again the page
                    if(err.message === "Request failed with status code 401"){
                        authService.logout();
                        navigate(__dirname);
                    }
                })

            }

        // get the number of orders from backend
        productsService.getNumberOfOrders()
            .then(o => setNumOfOrders(o))
            .catch(err => {
                console.log(err);
                notifyService.error(err)
            })
    },[]);

    return (
        <div className="Home">
            <h1>Half Free Supermarket</h1>
            {!user && <>
                <div className="helloMessage">
                    <span>Welcome Guest</span>
                </div>
                <div className="shoppingAction">
                    <span>Login or register for start shopping </span>
                    <br/>
                    <AuthMenu/>
                </div>
            </>
            }
            {user && !isAdmin && <>
                <div className="helloMessage">
                    <span>Hello {user.firstName} {user.lastName}</span>
                </div>
                {cart &&
                    <div className="shoppingAction">
                        <span>You have a cart from {cart.cartStartDate} </span>
                        <NavLink to={"/products"}>Continue Shopping</NavLink>
                        <span> | </span>
                        <NavLink to={"/newCart"}>New Cart</NavLink>
                        <br/>
                        <NavLink to={"/logout"}>Logout</NavLink> 
                    </div>}
                {!cart &&
                    <div className="shoppingAction">
                        <span>For start shopping press:  </span>
                        <br/>
                        <NavLink to={"/newCart"}>New Cart</NavLink>
                        <br/>
                        <NavLink to={"/logout"}>Logout</NavLink> 
                    </div>}
            </>}
            {user && isAdmin && <>
                
                <div className="AdminDiv">
                    <h3>Hello Admin</h3>
                    <NavLink to={"/products"}>To admin page press here</NavLink> 
                    <br/><br/>
                    <NavLink to={"/logout"}>To logout press here</NavLink>
                </div>
            
            </>}
            {numOfOrders && !isAdmin && <>
                <div className="countOfOrders">
                    <span>Already <span>{numOfOrders}</span> customers ordered in this website </span>
                    <br/>
                    <span> (and keep counting)</span>
                </div>
            </>}
        </div>
    );
}

export default Home;
