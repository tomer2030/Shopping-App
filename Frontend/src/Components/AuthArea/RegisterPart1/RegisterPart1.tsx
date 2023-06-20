import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import "./RegisterPart1.css";
import { RouteActionType, routeStore } from "../../../Redux/RouteState";
import { AuthActionType, authStore } from "../../../Redux/AuthState";
import notifyService from "../../../Services/NotifyService";

function RegisterPart1(): JSX.Element {

    const {register, watch, handleSubmit, formState} = useForm<UserModel>();
    const navigate = useNavigate();
    const password = useRef({});
    password.current = watch("password", "");
    const location = useLocation();

    useEffect(()=>{
        // save the current route in global state
        routeStore.dispatch({type:RouteActionType.changeRoute, payload: location.pathname})
    },[]);

    async function send(user: UserModel): Promise<void> {
        try {
            
            // get from backend if the data is valid
            const isValid = await authService.registerPart1(user);
            
            // if valid, continue to the second part of register
            if(isValid){
                authStore.dispatch({type: AuthActionType.ValidateRegister, payload: user});
                navigate("/register2");
            }

            // if not, alert to the user to try again
            else notifyService.error("the Id or email already in use");
        } catch (err: any) {
            console.log(err);
            notifyService.error(err);
        }
    }

    return (
        <div className="RegisterPart1 Box">
            <h2>Register</h2>
            <form onSubmit={handleSubmit(send)}>

                <label>ID</label>
                <input type="Number" {...register("userId", UserModel.validation.userId)} />
                {formState.errors.userId && <p>{formState.errors.userId?.message}</p>}
                <br/>

                <label>Email</label>
                <input type="email" {...register("email", UserModel.validation.email)} />
                {formState.errors.email && <p>{formState.errors.email?.message}</p>}
                <br/>

                <label>Password</label>
                <input type="password" {...register("password", UserModel.validation.password)} />
                {/* {formState.errors.password && <p>{formState.errors.password?.message}</p>} */}
                <br/>

                <label>Confirm Password</label>
                <input type="password" {...register("confirmPassword", {
                    required: true,
                    validate: value => 
                        value === password.current || "The Password don't match"
                })} />
                {formState.errors.confirmPassword && <p>{formState.errors.confirmPassword?.message}</p>}
                <button>Continue</button>
            </form>

        </div>
    );
}

export default RegisterPart1;
