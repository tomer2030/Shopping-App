import { Button, Collapse } from "react-bootstrap";
import { useEffect, useState } from "react";
import CategoryModel from "../../../Models/CategoryModel";
import ProductModel from "../../../Models/ProductModel";
import productsService from "../../../Services/ProductsService";
import Cart from "../Cart/Cart";
import ProductCard from "../ProductCard/ProductCard";
import "./AllProducts.css";
import authService from "../../../Services/AuthService";
import { useLocation, useNavigate } from "react-router-dom";
import { RouteActionType, routeStore } from "../../../Redux/RouteState";
import ProductCardForAdmin from "../ProductCardForAdmin/ProductCardForAdmin";
import { productsStore } from "../../../Redux/ProductsState";
import notifyService from "../../../Services/NotifyService";

function AllProducts(): JSX.Element {

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [cartId, setCartId] = useState<number>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()


    useEffect(()=>{

        // save the current route in global state
        routeStore.dispatch({type:RouteActionType.changeRoute, payload: location.pathname})

        // get all products
        productsService.getAllProducts()
            .then(p => setProducts(p))
            .catch(err => {
                    
                // print the error message
                console.log(err);
                notifyService.error(err);

    
                // if the error is an unauthorized request, log out the user and render again the page
                if(err.message === "Request failed with status code 401"){
                    authService.logout();
                    navigate("/home");
                }
            });

        // get all categories
        productsService.getAllCategories()
            .then(c =>setCategories(c))
            .catch(err =>{
                notifyService.error(err);
                console.log(err);
            });

        // get user
        const user = authService.getUser();

        if(user.roleId === 2) {
            // get an exist cart
            productsService.getAnExistCart(user.userId)
                .then(c => {
                    
                    // get the cart id
                    setCartId(c.cartId);
    
                })
                .catch(err => {
                    console.log(err)
                    notifyService.error(err);
                });
        } else setIsAdmin(true);

    },[]);

    // handle the button for open or close de cart
    const handleTriggerClick = () => setCartOpen(!cartOpen);

    // callback for close the cart
    const closeCart = () => setCartOpen(false);

    // handle add product for admin
    const handleAddProductForAdmin = () => navigate("add");

    return (
        <div className="AllProducts">
            {!isAdmin && products.length !== 0 && categories.length !== 0 && <>
            
                <Button className="CartButton" onClick={handleTriggerClick}>🛒</Button>
                <h2>All Products</h2>
                <div>
                    <Collapse in={cartOpen} unmountOnExit >
                        <div className="CartCollapse">
                            <Cart products={products} cartId={cartId} />
                        </div>
                    </Collapse>
                </div>
                {products.map(p => <ProductCard key={p.productId} product={p} category={categories.find(c => c.categoryId === p.categoryId)} closeCart={closeCart}/>)}
            </>}

            {isAdmin && products.length !== 0 && categories.length !== 0 && <>
            
                <Button className="AddButtonAdmin" onClick={handleAddProductForAdmin}>➕</Button>
                <h2>All Products</h2>
                {products.map(p => <ProductCardForAdmin key={p.productId} product={p} category={categories.find(c => c.categoryId === p.categoryId)}/>)}
            </>}
        </div>
    );
}

export default AllProducts;
