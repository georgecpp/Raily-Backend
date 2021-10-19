const Joi = require('@hapi/joi');


// Register Validation
const registerValidation=(data)=>{
    const schema=Joi.object({
        email: Joi.string().email().required(), 
        name: Joi.string().required(),
        password:Joi.string().required().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
        img: Joi.string().allow(null),
        fbuserId: Joi.string().allow(null),
    });
    return schema.validate(data);
}



// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    });

    return schema.validate(data);
}

const fbuserLoginValidation = (data) => {
    const schema = Joi.object({
        fbuserId: Joi.string().required(),
        password: Joi.string().required().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
    });

    return schema.validate(data);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.fbuserLoginValidation = fbuserLoginValidation;