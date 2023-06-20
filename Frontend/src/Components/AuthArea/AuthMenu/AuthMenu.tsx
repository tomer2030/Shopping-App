import { NavLink } from "react-router-dom";
import "./AuthMenu.css";

function AuthMenu(): JSX.Element {
    return (
        <div className="AuthMenu">
			<NavLink to="/Login"> Login</NavLink>
            <span> | </span>
			<NavLink to="/register1"> Register</NavLink>
        </div>
    );
}

export default AuthMenu;
