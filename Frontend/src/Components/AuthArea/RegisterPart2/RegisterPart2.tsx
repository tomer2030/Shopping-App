import { useLocation, useNavigate } from "react-router-dom";
import "./RegisterPart2.css";
import { useEffect, useState } from "react";
import { RouteActionType, routeStore } from "../../../Redux/RouteState";
import { useForm } from "react-hook-form";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";

function RegisterPart2(): JSX.Element {

    const location = useLocation();
    const {register, handleSubmit, formState} = useForm<UserModel>();
    const navigate = useNavigate();

    useEffect(()=>{

        // save the current route in global state
        routeStore.dispatch({type:RouteActionType.changeRoute, payload: location.pathname});

        
    },[]);

    async function registerUser(user: UserModel): Promise<void> {
        try {

            // get details from part 1 of the registration
            const registerPart1 = authService.getUser();

            // generate the userId to the part 2 of register
            user.userId = registerPart1.userId;

            // send to backend the registration
            await authService.registerPart2(user);
           
            notifyService.success(`hello ${user.firstName}! Let's shopping`);
            navigate("/home");

        } catch (err) {
            console.log(err);
            notifyService.error(err);
        }

    }

    return (
        <div className="RegisterPart2 Box">
			<h2>Register</h2>
            <form onSubmit={handleSubmit(registerUser)}>

                <label>First Name</label>
                <input type="string" {...register("firstName", UserModel.validation.firstName)}/>
                <br/><br/>
                
                <label>Last Name</label>
                <input type="string" {...register("lastName", UserModel.validation.lastName)}/>
                <br/><br/>

                <label>City</label>
                <input type="string" {...register("city", UserModel.validation.city)}/>
                <br/><br/>

                <label>Street</label>
                <input type="string" {...register("street", UserModel.validation.street)}/>
                <br/><br/>

                {formState.isValid && <button>Register</button>}
                {!formState.isValid && <button disabled>Register</button>}

            </form>
        </div>
    );
}

export default RegisterPart2;
