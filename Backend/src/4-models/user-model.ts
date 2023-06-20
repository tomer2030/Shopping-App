import Joi from "joi";

class UserModel  {
    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
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

    public static validationSchema1 = Joi.object({
        userId: Joi.number().required().positive().integer(),
        email: Joi.string().required().min(2).max(50),
        password: Joi.string().required().min(5).max(200),
        roleId: Joi.number().required(),
        firstName: Joi.optional(),
        lastName: Joi.optional(),
        street: Joi.optional(),
        city: Joi.optional()
    });

    public validate1(): string {
        const result = UserModel.validationSchema1.validate(this);
        return result.error?.message;
    }

    public static validationSchema2 = Joi.object({
        userId: Joi.optional(),
        email: Joi.optional(),
        password: Joi.optional(),
        roleId: Joi.optional(),
        firstName: Joi.string().required().min(2).max(20),
        lastName: Joi.string().required().min(2).max(20),
        city: Joi.string().optional().min(2).max(20),
        street: Joi.string().optional().min(2).max(20),
    });

    public validate2(): string {
        const result = UserModel.validationSchema2.validate(this);
        return result.error?.message;
    }
}

export default UserModel;