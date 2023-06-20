// Development config

class DevelopmentConfig {
    
    // is development?
    public isDevelopment = true;
    public isProduction = false;

    // Database: 
    public host = "localhost"; // Computer name/address of our database
    public user = "root"; // Database user
    public password = ""; // Database password
    public database = "shoppingCart"; // Database name

    // Server port: 
    public port = process.env.PORT || 3001;

}

class ProductionConfig {
    
    // is development?
    public isDevelopment = false;
    public isProduction = true;

    // heroku connection to Database: 
    public host = "eu-cdbr-west-03.cleardb.net"; // Computer name/address of our database
    public user = "b66cce1ce2b45b"; // Database user
    public password = "891d33b9"; // Database password
    public database = "heroku_19cbaf82fc942ae"; // Database name

    // Server port: 
    public port = process.env.PORT || 3001;

}

const appConfig = (process.env.NODE_ENV === "production") ? new ProductionConfig() : new DevelopmentConfig();

export default appConfig;