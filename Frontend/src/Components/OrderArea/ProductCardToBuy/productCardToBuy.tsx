import { useEffect, useState } from "react";
import ProductCartModel from "../../../Models/ProductCartModel";
import "./ProductCardToBuy.css";
import productsService from "../../../Services/ProductsService";
import ProductModel from "../../../Models/ProductModel";
import notifyService from "../../../Services/NotifyService";

interface ProductCardToBuyProps {
	productCart: ProductCartModel;
    allProducts: ProductModel[];
    handleRemoveProduct: Function;
}

function ProductCardToBuy(props: ProductCardToBuyProps): JSX.Element {

    const [quantity, setQuantity] = useState<number>(props.productCart.quantity);
    const [productName, setProductName] = useState<string>("");

    useEffect(()=>{

        // find the product name
        const findProductName = props.allProducts.find(product => product.productId === props.productCart.productId
        )?.productName;

        // put in in the component state
        setProductName(findProductName)
            

    },[]);

    // function for handle the change the quantity
    const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    
        // change the quantity in component state
        setQuantity(Number(event.currentTarget.value));
    }

    // function for update the change of quantity
    const handleUpdateQuantity = (quantityToUpdate: number) => {
        
        // check if the quantity is 0
        if(quantityToUpdate === 0){

            // remove the product
            productsService.removeProductFromCart(props.productCart.productCartId).catch(err=>{
                notifyService.error(err);
                console.log(err);   
            })
        } else {

            props.productCart.quantity = quantityToUpdate 

            productsService.updateQuantityInCart(props.productCart)
                .then(updatedProduct =>{
                
                // props.productCart = updatedProduct;
                notifyService.success("the quantity updated successfully");
            }).catch(err => {
                notifyService.error(err);
                console.log(err);   
            })

        }  
    }


    return (
        
			<tr key={props.productCart.productCartId}>
                <td>{productName}</td>
                <td>
                    <input type="number" value={quantity} onChange={handleChangeQuantity}/>
                    <button onClick={() => handleUpdateQuantity(quantity)}>Update Quantity</button>
                </td>
                <td>{props.productCart.totalPrice}</td>
                <td><button onClick={() => props.handleRemoveProduct(props.productCart.productCartId)}>❌</button></td>
            </tr>
        
    );
}

export default ProductCardToBuy;
