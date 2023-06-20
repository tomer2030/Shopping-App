import { useNavigate } from "react-router-dom";
import CategoryModel from "../../../Models/CategoryModel";
import ProductModel from "../../../Models/ProductModel";
import appConfig from "../../../Utils/Config";
import "./ProductCardForAdmin.css";
import EditProduct from "../EditProduct/EditProduct";
import { NavLink } from "react-router-dom";

interface ProductCardForAdminProps {
    product: ProductModel;
	category: CategoryModel;

}

function ProductCardForAdmin(props: ProductCardForAdminProps): JSX.Element {

    const editRoute = "/products/edit/" + props.product.productId

    return (
        <div className="Card Box">
            {<>
            
                <h3>{props.product.productName}</h3>
                <div>
                    <span>Category: {props.category?.categoryName }</span>
                    <br/>
                    <span>Price: {props.product.price}$</span>
                    <br/>
                    <img src={appConfig.productsImgUrl + props.product.imageName} />
                    <br/>       
                </div>
                <NavLink to={editRoute}>📝</NavLink>
            
            </>}
        </div>
    );
}

export default ProductCardForAdmin;
