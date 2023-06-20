import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import "./Login.css";
import { RouteActionType, routeStore } from "../../../Redux/RouteState";
import { useEffect } from "react";
import notifyService from "../../../Services/NotifyService";
import { Button } from "@mui/material";

function Login(): JSX.Element {
    
    const {register, handleSubmit, formState} = useForm<CredentialsModel>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        
        // save the current route in global state
        routeStore.dispatch({type:RouteActionType.changeRoute, payload: location.pathname})

    },[]);

    async function send(credentials: CredentialsModel): Promise<void> {
        try {
            await authService.login(credentials);
            navigate("/home");
            notifyService.success("welcome back! let's shopping!!");
            
        } catch (err: any) {
            console.log(err);
            notifyService.error(err);
        }
    }
    
    return (
        <div className="Login Box">
			<form onSubmit={handleSubmit(send)}>
                <h2>Login</h2>

                <label>Email: </label>
                <input type="text" {...register("email", CredentialsModel.validation.email)}/>
                {formState.errors.email && <>
                    <br/>
                    <span>{formState.errors.email?.message}</span>
                </>}
                <br/>
                
                <label>Password: </label>
                <input type="password" {...register("password", CredentialsModel.validation.password)} />
                {formState.errors.password && <>
                    <br/>
                    <span>{formState.errors.password?.message}</span>
                    
                </>}
                
                
                {!formState.isValid && <Button variant="outlined" disabled type="submit">Submit</Button> }
                {formState.isValid && <Button variant="outlined" type="submit">Submit</Button> }
            </form>
        </div>
    );
}

export default Login;
