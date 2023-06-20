import { useForm } from "react-hook-form";
import "./ChangeAddress.css";
import ChangeAddressModel from "../../../Models/ChangeAddressModel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";

function ChangeAddress(): JSX.Element {
    
    const {register, handleSubmit} = useForm<ChangeAddressModel>();
    const navigate = useNavigate();
    const [oldAddress, setOldAddress] = useState<ChangeAddressModel>(null);

    useEffect(()=>{

        let city: string;
        let street: string;
        // make an object
        let addressObject : ChangeAddressModel;
        
        // if already there is value in local storage, take it
        if(localStorage.getItem("newCity")){

            addressObject = {city: localStorage.getItem("newCity"), street: localStorage.getItem("newStreet")};

        } else{

            // get the user details for his address
            const user = authService.getUser();
            addressObject = {city: user.city, street: user.street};
        }

        setOldAddress(addressObject);
    }, []);

    async function sendChange(newAddress: ChangeAddressModel){
        try {

            // save the new address in local storage
            localStorage.setItem("newCity", newAddress.city)
            localStorage.setItem("newStreet", newAddress.street);
            navigate("/productsToBuy");
        } catch (err) {
            console.log(err);
            notifyService.error(err);
        }
    }

    const handleCancelClick = () => {
        navigate("/productsToBuy");
    }
    
    return (
        <div className="ChangeAddress Box"> 
        {
            oldAddress && <>
			<form onSubmit={handleSubmit(sendChange)}>
                <h2>Change Address</h2>

                <label>City</label>
                <input type="text" {...register("city")} defaultValue={oldAddress.city}/>
                <br/>

                <label>Street</label>
                <input type="text" {...register("street")} defaultValue={oldAddress.street}/>

                <button>Submit</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
            </form>
            
            </>
        }
        </div>
    );
}

export default ChangeAddress;
