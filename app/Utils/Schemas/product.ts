import joi from 'joi';

export const productSchema = joi.object({
    name: joi.string().min(3).required(),
    description: joi.string().optional(),
    stock: joi.number().positive().min(1).required(),
    price: joi.number().positive().min(0.01).required(),
    isPerishable: joi.boolean().required(),
    expirationDate: joi
        .date()
        .iso()
        .when('isPerishable', {
            is: true,
            then: joi.required(),
            otherwise: joi.forbidden(),
        })
        .min("now"),
    batch: joi
        .string()
        .when('isPerishable', {
            is: true,
            then: joi.required(),
            otherwise: joi.forbidden(),
        }),
});
