import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import Address from 'App/Models/Address';
import Product from 'App/Models/Product';
import Sale from 'App/Models/Sale';
import User from 'App/Models/User';

export default class ExistingEntity {
    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>, models: string[]) {
        const { id } = request.params();
    
        if(!id || isNaN(Number(id))) return response.badRequest({ message: `You must to provide a valid ${models[0]} identifier.` });

        const modelMap: { [key: string]: typeof BaseModel } = {
            Sale,
            User,
            Address,
            Product
        };

        const model = modelMap[models[0]];

        if (!model) return response.badRequest({ error: 'Invalid model.' });

        try {            
            const entity = await model.find(id);
            if(!entity) return response.notFound({ message: `${models[0]} not found.` });

            await next();
        } catch (e: any) {
            console.log(e);
            return response.badRequest({ message: 'Invalid dataset.' });
        }
    }
}
