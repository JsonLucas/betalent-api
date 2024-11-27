import { Role } from 'App/Enums/Role';
import joi from 'joi';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const userSignUpSchema = joi.object({
    name: joi.string().min(2),
    email: joi.string().email().required(),
    password: joi.string()
        .min(8)
        .regex(passwordRegex)
        .required()
        .messages({
            'string.min': 'A senha deve ter pelo menos 8 caracteres',
            'string.pattern.base': 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
        }),
    birthDate: joi.date().required(),
    role: joi.valid(...Object.values(Role)).optional(),
    cpf: joi.string().length(11).pattern(/^\d+$/).required().messages({
        'string.length': 'The CPF must have exactly 11 digits',
        'string.pattern.base': 'The CPF must contain only numbers',
    })
});

export const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

export const userAddressShema = joi.object({
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().min(2).required(),
    zipCode: joi.string().length(8).pattern(/^\d+$/).required(),
    country: joi.string().min(2).required()
})