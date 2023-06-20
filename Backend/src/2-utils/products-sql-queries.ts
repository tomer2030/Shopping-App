class ProductsSqlQueries {

    public getAllProducts = `
        SELECT * FROM products
    `;

    public getAllCategories = `
        SELECT * FROM categories
    `;

    public getProductsByCategory = `
        SELECT * FROM products
        WHERE categoryId = ?
    `;

    public getOneProduct = `
        SELECT * FROM products
        WHERE productId = ?
    `;

    public startNewCart = `
        INSERT INTO carts
        VALUES( DEFAULT, ?, ?)
    `;

    public removeCart = `
        DELETE FROM carts
        WHERE cartId = ?
    `;

    public allProductsFromCart = `
        SELECT * 
        FROM productsCart
        WHERE cartId = ?
    `;

    public existCart = `
        SELECT * 
        FROM carts
        WHERE userId = ?
    `;

    public orderedCart = `
        SELECT * 
        FROM orders
        WHERE userId = ?
    `;

    public addProductToCart = `
        INSERT INTO productsCart
        VALUES( DEFAULT, ?, ?, ?, ?)
    `;

    public removeProductFromCart = `
        DELETE FROM productsCart
        WHERE productCartId = ?
    `;

    public updateQuantityOfProductInCart = `
        UPDATE productsCart
        SET quantity = ?, totalPrice = ?
        WHERE productCartId = ?
    `;

    public getOneProductCart = `
        SELECT * 
        FROM productsCart
        WHERE productCartId = ?
    `;

    public addProductToList = `
        INSERT INTO products
        VALUES( DEFAULT, ?, ?, ?, ?)
    `;

    public updateProductInList = `
        UPDATE products
        SET 
            productName = ?,
            categoryId = ?,
            price = ?,
            imageName = ?
        WHERE productId = ?
    `;

    public sendNewOrder = `
        INSERT INTO orders
        VALUES ( DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    public numberOfOrders = `
        SELECT orderId FROM orders
    `;
}

const productsSqlQueries = new ProductsSqlQueries();

export default productsSqlQueries;