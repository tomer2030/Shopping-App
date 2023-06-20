import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../Services/AuthService";
import "./Logout.css";
import notifyService from "../../../Services/NotifyService";

function Logout(): JSX.Element {

    const navigate = useNavigate();

    useEffect(()=>{

        // delete the token from local storage and from global state
        authService.logout();

        notifyService.success("see you soon!");

        navigate("/home");

    },[]);

    return null;
}

export default Logout;
