class ProductCartModel {
    public productCartId: number;
    public productId: number;
    public quantity: number;
    public totalPrice: number;
    public cartId: number;

    public constructor(productId: number, quantity: number, cartId: number) {
        this.productId = productId;
        this.quantity = quantity;
        this.cartId = cartId;
    }

    public static validation = {
        productId: {
            required: {value: true, message: "Missing product Id"},
        },
        cartId: {
            required: {value: true, message: "Missing cart Id"},
        },
        quantity: {
            required: {value: true, message: "Missing quantity"},
            min: {value: 0, message: "Quantity too short"},
            max: {value: 10000, message: "Quantity too long"}
        },
    }
}

export default ProductCartModel;