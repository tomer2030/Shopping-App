import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
// import backgroundImage from "../../../Assets/Images/supermarket.jpg";
import "./Layout.css";

function Layout(): JSX.Element {
    
    const location = useLocation();
    
    return (

        <div className="Layout">
            {location.pathname === "/home" &&
            <>
                <Routing/>
            </>}
            {location.pathname !== "/home" &&
            <>
                <Menu/>
                <Header/>
                <hr/>
                {/* <img src={backgroundImage}/> */}
                <Routing/>
            </>}
        </div>
    );
}

export default Layout;
