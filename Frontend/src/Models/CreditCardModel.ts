class CreditCardModel {
    public creditCard: number;
    public ID: number;
    public validity: Date;
    public cvv: number;

    public constructor(credentials: CreditCardModel) {
        this.creditCard = credentials.creditCard;
        this.ID = credentials.ID;
        this.validity = credentials.validity;
        this.cvv = credentials.cvv;
    }

    public static validation = {
        creditCard: {
            required: {value: true, message: "Missing creditCard number"},
            minLength: {value: 5, message: "CreditCard number too short"},
            maxLength: {value: 20, message: "CreditCard number too long"}
        },
        ID: {
            required: {value: true, message: "Missing ID number"},
            minLength: {value: 5, message: "ID number too short"},
            maxLength: {value: 20, message: "ID number too long"}
        },
        validity: {
            required: {value: true, message: "Missing validity"}
        },
        cvv: {
            required: {value: true, message: "Missing cvv"},
            minLength: {value: 3, message: "Cvv too short"},
            maxLength: {value: 4, message: "Cvv too long"}
        },
        
    }
}

export default CreditCardModel;