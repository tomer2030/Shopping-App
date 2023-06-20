class UserModel {
    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public confirmPassword: string;
    public city: string;
    public street: string;
    public roleId: number;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.city = user.city;
        this.street = user.street;
        this.roleId = user.roleId;
    }

    public static validation = {
        userId: {
            required: {value: true, message: "Missing ID"},
            minLength: {value: 5, message: "ID too short"},
            maxLength: {value: 20, message: "ID too long"}
        },
        firstName: {
            required: {value: true, message: "Missing first name"},
            minLength: {value: 2, message: "First name too short"},
            maxLength: {value: 20, message: "First name too long"}
        },
        lastName: {
            required: {value: true, message: "Missing last name"},
            minLength: {value: 2, message: "Last name too short"},
            maxLength: {value: 20, message: "Last name too long"}
        },
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
        },
        confirmPassword: {
            required: {value: true, message: "Missing password confirmation"},

        },
        // maybe i will use an rest api address. i will need to change the validation  
        city: {
            required: {value: true, message: "Missing city"},
            minlength: {value: 2, message: "City name too short"},
            maxLength: {value: 20, message: "City name too long"}
        },
        street: {
            required: {value: true, message: "Missing street"},
            minLength: {value: 2, message: "Street name too short"},
            maxLength: {value: 20, message: "Street name too long"}
        }
    }
}

export default UserModel;