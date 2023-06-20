import { useEffect, useState } from "react";
import CartModel from "../../../Models/CartModel";
import CategoryModel from "../../../Models/CategoryModel";
import ProductCartModel from "../../../Models/ProductCartModel";
import ProductModel from "../../../Models/ProductModel";
import authService from "../../../Services/AuthService";
import productsService from "../../../Services/ProductsService";
import appConfig from "../../../Utils/Config";
import "./ProductCard.css";
import notifyService from "../../../Services/NotifyService";

interface ProductCardProps {
	product: ProductModel;
	category: CategoryModel;
    closeCart: Function;
}

function ProductCard(props: ProductCardProps): JSX.Element {

    const [quantity, setQuantity] = useState<number>(0);
    const [cart, setCart] = useState<CartModel>();
    const [productExistInCart, setProductExistInCart] = useState<boolean>(false);

    useEffect(()=>{

        // get the user for the cart
        let user = authService.getUser()

        // get the cart details
        productsService.getAnExistCart(user.userId)
            .then(c => {

                // set the cart details in the component state
                setCart(c);

                // check if the product is already in cart. if it is, change the quantity
                productsService.getAllProductsFromCart(c.cartId)
                    .then(p => {

                        // find the index of the product in the shopping cart list
                        const index = p.findIndex(pro => pro.productId === props.product.productId)

                        // if exist
                        if(index !== -1){

                            // change the boolean parameter for change the button (add / update)
                            setProductExistInCart(true)
                        } 
                    })
            })
            .catch(err => {
                notifyService.error(err);
                console.log(err);   
            });
        
        
    },[]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        // set the quantity in the state
        setQuantity(Number(event.currentTarget.value));
      };
    const handleAdd = () => {

        // make a new product cart object
        const productToCart = new ProductCartModel(props.product.productId, quantity, cart.cartId);

        // add the product to cart
        productsService.addProductToCart(productToCart)
            .then(()=> {

                // if the quantity is 0
                if(quantity === 0){
                    notifyService.success("the product deleted successfully to cart");
                    setProductExistInCart(false);
                } else {
                    notifyService.success("the product added successfully to cart");
                    setProductExistInCart(true);

                }
                setQuantity(0);
                props.closeCart();
            })
            .catch(err => {
                console.log(err)
                notifyService.error(err);
            });
    }
    
    return (
        <div className="Box Card">
			<h3>{props.product.productName}</h3>
            <div>
                <span>Category: {props.category.categoryName}</span>
                <br/>
                <span>Price: {props.product.price}$</span>
                <br/>
                <img src={appConfig.productsImgUrl + props.product.imageName} />
                <br/>       
            </div>
            <div  className="ProductDescription">
                <label>Add to cart: </label>
                <input type="number" min={0} value={quantity} onChange={handleInputChange}/>
                {productExistInCart && <>{
                    quantity === 0 &&  <button disabled className="UpdateButton" type="button" onClick={handleAdd}>Update</button> || <button className="UpdateButton" type="button" onClick={handleAdd}>Update</button>
                }</>}
                {!productExistInCart && <>{
                    quantity === 0 && <button disabled className="AddButton" type="button" onClick={handleAdd}>Add</button> || <button className="AddButton" type="button" onClick={handleAdd}>Add</button> 
                }</>}
            </div>
        </div>
    );
}

export default ProductCard;
