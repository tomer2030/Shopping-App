class ProductModel {
    public productId: number;
    public productName: string;
    public categoryId: number;
    public price: number;
    public image: FileList;
    public imageName: string;

    public constructor(product: ProductModel) {
        this.productId = product.productId;
        this.productName = product.productName;
        this.categoryId = product.categoryId;
        this.price = product.price;
        this.image = product.image;
        this.imageName = product.imageName;
    }

    public static validation = {
        productName: {
            required: {value: true, message: "Missing name"},
            minLength: {value: 2, message: "Name too short"},
            maxLength: {value: 20, message: "Name too long"}
        },
        category: {
            required: {value: true, message: "Missing category"},
        },
        price: {
            required: {value: true, message: "Missing price"},
            min: {value: 0, message: "Price too short"},
            max: {value: 10000, message: "Price too long"}
        },
    }
}

export default ProductModel;