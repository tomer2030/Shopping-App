import ProductCartModel from "./ProductCartModel";
import UserModel from "./UserModel";

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

    public constructor (cartId: number, userId: number, productsInCart: ProductCartModel[], deliveryCity: string, deliveryStreet: string, deliveryDate: Date, orderDate: Date, creditCard: number) {
        this.cartId = cartId;
        this.userId = userId;

        // calculate the final price ////check it/////
        let finalPrice = 0; 
        productsInCart.forEach(p => finalPrice += p.totalPrice );
        this.finalPrice = finalPrice;

        this.deliveryCity = deliveryCity;
        this.deliveryStreet = deliveryStreet;
        this.deliveryDate = deliveryDate;
        this.creditCard = creditCard;
        this.orderDate = orderDate;
    }

    public static validation = {
        finalPrice: {
            required: {value: true, message: "Missing final price"},
        },
        cartId: {
            required: {value: true, message: "Missing cart Id"},
        },
        userId: {
            required: {value: true, message: "Missing user Id"},
        },
        deliveryCity: {
            required: {value: true, message: "Missing city name"},
            minlength: {value: 2, message: "City name too short"},
            maxLength: {value: 20, message: "City name too long"}
        },
        deliveryStreet: {
            required: {value: true, message: "Missing street name"},
            minlength: {value: 2, message: "Street name too short"},
            maxLength: {value: 20, message: "Street name too long"}
        },
        deliveryDate: {
            required: {value: true, message: "Missing delivery date"}
        },
        // add regex
        creditCard: {
            required: {value: true, message: "Missing creditCard"},
        },
    }
}

export default OrderModel;