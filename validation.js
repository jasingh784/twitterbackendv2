//VALIDATION
const Joi = require("joi");


//REGISTER VALIDATION
const registerValidation = (data) => {
        const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().min(6).required().email(),
        username: Joi.string().required().min(6).max(25),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(data);
    
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })

    return schema.validate(data);

}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;