import Joi from "joi";

class CartModel {
    public cartId: number;
    public userId: number;
    public cartStartDate: Date;

    public static validationSchema = Joi.object({
       cartId: Joi.number().optional().positive().integer(),
       userId: Joi.number().required().positive().integer(),
       cartStartDate: Joi.date().required()
    });

    public validate() :string {
        const result = CartModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default CartModel;