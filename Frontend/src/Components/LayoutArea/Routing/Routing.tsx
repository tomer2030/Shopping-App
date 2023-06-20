import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import RegisterPart1 from "../../AuthArea/RegisterPart1/RegisterPart1";
import RegisterPart2 from "../../AuthArea/RegisterPart2/RegisterPart2";
import Home from "../../HomeArea/Home/Home";
import AllProducts from "../../ProductsArea/AllProducts/AllProducts";
import NewCart from "../../ProductsArea/NewCart/NewCart";
import PageNotFound from "../PageNotFound/PageNotFound";
import "./Routing.css";
import ProductsToBuy from "../../OrderArea/ProductsToBuy/ProductsToBuy";
import Payment from "../../OrderArea/Payment/Payment";
import Ordered from "../../OrderArea/Ordered/Ordered";
import ChangeAddress from "../../OrderArea/ChangeAddress/ChangeAddress";
import EditProduct from "../../ProductsArea/EditProduct/EditProduct";
import AddProduct from "../../ProductsArea/AddProduct/AddProduct";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
			<Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register1" element={<RegisterPart1 />} />
                <Route path="/register2" element={<RegisterPart2 />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/newCart" element={<NewCart />} />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="*" element={<PageNotFound />} />
                <Route path="/productsToBuy" element={<ProductsToBuy />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/ordered" element={<Ordered />} />
                <Route path="/changeAddress" element={<ChangeAddress />} />
                <Route path="/products/edit/:productId" element={<EditProduct />} />
                <Route path="/products/add" element={<AddProduct />} />

            </Routes>
        </div>
    );
}

export default Routing;
