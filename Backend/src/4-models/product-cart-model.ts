import Joi from "joi";

class ProductCartModel {
    productCartId: number;
    productId: number;
    quantity: number;
    totalPrice: number;
    cartId: number;

    public constructor(product: ProductCartModel) {
        
        this.productCartId = product.productCartId;
        this.productId = product.productId;
        this.quantity = product.quantity;
        this.cartId = product.cartId;

    }

    public static validationSchema = Joi.object({
        productCartId: Joi.number().optional().positive().integer(),
        productId: Joi.number().required().positive().integer(),
        quantity: Joi.number().required().positive().integer().min(1),
        totalPrice: Joi.number().optional().positive().min(0),
        cartId: Joi.number().required().positive().integer(),
    });

    public validate(): string {
        const result = ProductCartModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default ProductCartModel;