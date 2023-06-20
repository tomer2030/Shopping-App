import Joi from "joi";

class OrderModel {
    orderId: number;
    cartId: number;
    userId: number;
    finalPrice: number;
    deliveryCity: string;
    deliveryStreet: string;
    deliveryDate: Date;
    orderDate: Date;
    creditCard: number;

    public constructor (order: OrderModel) {
        this.orderId = order.orderId;
        this.cartId = order.cartId;
        this.userId = order.userId;
        this.finalPrice = order.finalPrice;
        this.deliveryCity = order.deliveryCity;
        this.deliveryStreet = order.deliveryStreet;
        this.deliveryDate = order.deliveryDate;
        this.orderDate = order.orderDate;
        this.creditCard = order.creditCard;
    }

    public static validationSchema = Joi.object({
        orderId: Joi.number().optional().positive().integer(),
        cartId: Joi.number().required().positive().integer(),
        userId: Joi.number().required().positive().integer(),
        finalPrice: Joi.number().required().positive(),
        deliveryCity: Joi.string().required().min(2).max(20),
        deliveryStreet: Joi.string().required().min(2).max(20),
        orderDate: Joi.date().required(),
        deliveryDate: Joi.date().required(),
        creditCard: Joi.date().required()
    });

    public validate(): string {
        const result = OrderModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default OrderModel;