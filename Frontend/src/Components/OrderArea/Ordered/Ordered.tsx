import { useEffect, useState } from "react";
import "./Ordered.css";
import { useNavigate } from "react-router-dom";

function Ordered(): JSX.Element {

    const [timer,setTimer] = useState<number>(3);
    const navigate = useNavigate();

    useEffect(()=>{

        const intervalId = setInterval(()=>{
            setTimer(a-=1);            
        }, 1000);
        let a = 3
        setTimeout(() => {
            
            // stop the interval
            clearInterval(intervalId);

            // navigate to main page
            navigate("/home")
        }, 3000);

    },[]);

    return (
        <div className="Ordered">
            <h2>Thanks you for your order!</h2>
            <h4>You will go back to main page in {timer} seconds...</h4>
        </div>
    );
}

export default Ordered;
