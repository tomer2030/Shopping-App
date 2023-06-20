import { UploadedFile } from "express-fileupload";
import Joi from "joi";

class ProductModel {
    public productId: number;
    public productName: string;
    public categoryId: number;
    public price: number;
    public imageName: string;
    public image: UploadedFile;

    public constructor(product: ProductModel) {
        this.productId = product.productId;
        this.productName = product.productName;
        this.categoryId = product.categoryId;
        this.price = product.price;
        this.imageName = product.imageName;
        this.image = product.image;
    }

    public static validationSchema = Joi.object({
        productId: Joi.number().optional().positive().integer(),
        productName: Joi.string().required().min(2).max(20),
        categoryId: Joi.number().required().positive().integer(),
        price: Joi.number().required().min(0).positive(),
        imageName: Joi.string().optional().min(2).max(200),
        image: Joi.optional()
    });

    public validate(): string {
        const result = ProductModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default ProductModel;