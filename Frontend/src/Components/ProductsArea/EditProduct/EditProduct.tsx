import { Button,  InputLabel,  MenuItem,  Select,  SelectChangeEvent,  TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import "./EditProduct.css";
import ProductModel from "../../../Models/ProductModel";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import productsService from "../../../Services/ProductsService";
import CategoryModel from "../../../Models/CategoryModel";
import { FormControl } from "react-bootstrap";
import notifyService from "../../../Services/NotifyService";


function EditProduct(): JSX.Element {
    
    const {register, handleSubmit, formState, setValue} = useForm<ProductModel>();
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [previousCategory, setPreviousCategory] = useState<CategoryModel>();
    const params = useParams();
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<number>();
    

    useEffect(()=>{
        const id = +params.productId;
        productsService.getAllCategories()
            .then(c => {
                setCategories(c);
                productsService.getOneProducts(id)
                    .then(p => {
                        // set the product values in the form
                        setValue("productId", p.productId);
                        setValue("productName", p.productName);
                        setValue("categoryId", p.categoryId);
                        setValue("price", p.price);
    
                        // set the previous category
                        setPreviousCategory(c.find(oneC => p.categoryId === oneC.categoryId) )
                    })
                .catch(err => {
                    notifyService.error(err);
                    console.log(err);   
                });
            })
            .catch(err =>{
                notifyService.error(err);
                console.log(err);   
            })
    },[]);

    async function send(product: ProductModel){
        try {
            await productsService.updateProductFromList(product);
            notifyService.success("The product successfully updated")
            navigate("/products");
            
        } catch (err) {
            notifyService.error(err);
            console.log(err);           }
    }

    // function for handle if there is an error or not
    function handleErrorBox(err: any) {
        if(err) return true;
        return false
    }

    const handleSelectedOption = (event:  SelectChangeEvent) => setSelectedOption(+event.target.value);

    const handleCancelButton = () => navigate("/products");

    return (
        <div className="EditProduct Box">
			<form onSubmit={handleSubmit(send)}>
                <h2>Edit Product</h2>

                <input type="hidden" {...register("productId")}/>

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
                {categories.length !== 0 && previousCategory && <>
                    <div className="CategoryDiv"><label className="CategoryLabel">Category</label></div>
                    <Select
                        id="category"
                        value={selectedOption}
                        onChange={handleSelectedOption}
                        defaultValue={previousCategory.categoryId}
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

                <Button className="MuiButton" variant="contained" type="submit">Update</Button>
                <Button onClick={handleCancelButton} className="MuiButton" variant="contained" type="button">Cancel</Button>

            </form>
        </div>
    );
}

export default EditProduct;
