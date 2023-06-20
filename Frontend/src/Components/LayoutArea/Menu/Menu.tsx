import { NavLink, useLocation } from "react-router-dom";
import "./Menu.css";
import { useEffect, useState } from "react";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import { routeStore } from "../../../Redux/RouteState";

function Menu(): JSX.Element {

    const [user, setUser] = useState<UserModel>(null);

    // component state for the user location
    const [currentLocation, setCurrentLocation] = useState<string>(useLocation().pathname);

    useEffect(()=>{

        // get the user
        const getUser = authService.getUser();

        // check that there is an user and put it in state
        if(getUser) setUser(getUser);

        // where there is a change in the route name in global state, set it in the component state 
        const unsubscribe =  routeStore.subscribe(()=>{
            setCurrentLocation(routeStore.getState().route);
        })

        return () => unsubscribe()
    },[]);


    return (
        <div className="Menu">
            {(currentLocation == "/products" && user?.roleId === 2) && <>
                <span> Hello {user.firstName + " " + user.lastName}, let's shopping! | </span>
			    <span><NavLink to="/logout">Logout</NavLink></span>
            </>}
            {(currentLocation === "/register1" || currentLocation === "/Login" )&& <>
                <NavLink to="/home">Back To Home</NavLink>
            </>}
            {(currentLocation === "/payment" && user?.roleId === 2)&& <>
                <NavLink to="/products">Back To Shopping</NavLink>
            </>}
            {(user?.roleId === 1 ) && <>
                <span> Hello {user.firstName} | </span>
                <span><NavLink to="/logout">Logout</NavLink></span>
            </>}
            
        </div>
    );
}

export default Menu;
