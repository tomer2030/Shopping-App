class Config {
    private serverUrl = "http://localhost:3001/api/";
    public productsUrl = this.serverUrl + "products/";
    public productsImgUrl = this.productsUrl + "img/";
    public productsByCategoryUrl = this.productsUrl + "product-by-category/";
    public cartUrl = this.serverUrl + "cart/";
    public cartProductsUrl = this.cartUrl + "products/";
    public categoriesUrl = this.serverUrl + "categories/";
    public ordersUrl = this.serverUrl + "orders/";
    private authUrl = this.serverUrl + "auth/";
    public loginUrl = this.authUrl + "login/";
    public registerPart1Url = this.authUrl + "register/validate/";
    public registerPart2Url = this.authUrl + "register/";
}

const appConfig = new Config(); // Singleton

export default appConfig;
