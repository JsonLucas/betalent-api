import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Validator } from 'App/Helpers/Validator/Validator'
import { productSchema } from 'App/Utils/Schemas/product'
import { saleSchema } from 'App/Utils/Schemas/sale'
import { userAddressShema, userLoginSchema, userSignUpSchema } from 'App/Utils/Schemas/user'
import Joi from 'joi';

export default class ValidateRequestMiddleware {
    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>, schemas: string[]) {
        const schemaMap: { [key: string]: Joi.ObjectSchema } = {
            userSignup: userSignUpSchema,
            userLogin: userLoginSchema,
            address: userAddressShema,
            product: productSchema,
            sale: saleSchema,
        };

        const schema = schemaMap[schemas[0]];

        if (!schema) return response.badRequest({ error: 'Invalid validation schema.' });

        try {
            const validator = Validator.create();
            await validator.validate(schema, request.body());
            await next();
        } catch (e: any) {
            console.log(e);
            return response.unprocessableEntity({
                messge: 'Invalid data format.',
                error: e.details.map((err: Joi.ValidationErrorItem) => err.message.split('\"').join('').trim()),
            });
        }
    }
}
