class CredentialsModel {
    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    public static validation = {
        // add regex
        email: {
            required: {value: true, message: "Missing email"},
            minLength: {value: 2, message: "Email too short"},
            maxLength: {value: 50, message: "Email too long"}
        },
        // add regex
        password: {
            required: {value: true, message: "Missing password"},
            minLength: {value: 2, message: "Password too short"},
            maxLength: {value: 20, message: "Password too long"}
        }
    }
}

export default CredentialsModel;