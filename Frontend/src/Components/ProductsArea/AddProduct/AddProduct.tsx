import { useForm } from "react-hook-form";
import "./AddProduct.css";
import ProductModel from "../../../Models/ProductModel";
import { useEffect, useState } from "react";
import CategoryModel from "../../../Models/CategoryModel";
import { useLocation, useNavigate } from "react-router-dom";
import productsService from "../../../Services/ProductsService";
import { Button, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { productsStore } from "../../../Redux/ProductsState";
import { RouteActionType, routeStore } from "../../../Redux/RouteState";
import notifyService from "../../../Services/NotifyService";

function AddProduct(): JSX.Element {
    const {register, handleSubmit, formState} = useForm<ProductModel>();
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<string>();
    const location = useLocation();

    useEffect(()=>{

        routeStore.dispatch({type: RouteActionType.changeRoute, payload: location.pathname});

        productsService.getAllCategories()
            .then(c => setCategories(c))
            .catch(err => {
                notifyService.error(err);
                console.log(err);   
            });
        
        if(productsStore.getState().products.length === 0){
            navigate("/products");
        }

    },[]);
    
    async function send(product: ProductModel){
        try {
            await productsService.addNewProductToList(product);
            notifyService.success("The product added successfully")
            navigate("/products");
            
        } catch (err) {
            notifyService.error(err);
            console.log(err);   
        }
    }

    // function for handle if there is an error or not
    function handleErrorBox(err: any) {
        if(err) return true;
        return false
    }

    function handleSelectedOption(event:  SelectChangeEvent){
        setSelectedOption(event.target.value);
    }

    const handleCancelButton = () => navigate("/products");

    return (
        <div className="AddProduct Box">
			<form onSubmit={handleSubmit(send)}>
                <h2>Add Product</h2>

                <TextField
                    className="MuiInput"
                    type="text"
                    label="Product Name"
                    variant="outlined"
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={handleErrorBox(formState.errors.productName)}
                    {...register("productName", ProductModel.validation.productName)}
                    helperText={formState.errors.productName?.message}
                />

                {/* read documentation of Switch MUI */}
                {categories.length !== 0 && <>
                    <div className="CategoryDiv"><label className="CategoryLabel">Category</label></div>
                    <Select
                        id="category"
                        defaultValue={""}
                        value={selectedOption}
                        onChange={handleSelectedOption}
                        {...register("categoryId")}
                        size="small">
                        {categories.map(c => <MenuItem key={c.categoryId} value={c.categoryId}>{c.categoryName}</MenuItem>)}
                    </Select>
                    <br/><br/><br/>
                
                </>}

                <TextField
                    className="MuiInput"
                    type="number"
                    label="Price"
                    variant="outlined"
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={handleErrorBox(formState.errors.price)}
                    {...register("price", ProductModel.validation.price)}
                    helperText={formState.errors.price?.message}
                />
                <div className="imgBox">
                    <label>Product Picture: </label>
                    <input accept="image/*" type="file" {...register("image")}/>
                    <br/><br/>
                </div>

                <Button className="MuiButton" variant="contained" type="submit">Add</Button>
                <Button onClick={handleCancelButton} className="MuiButton" variant="contained" type="button">Cancel</Button>

            </form>
        </div>
    );
}

export default AddProduct;
