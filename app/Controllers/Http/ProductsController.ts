import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Role } from 'App/Enums/Role';
import Product from 'App/Models/Product';

export default class ProductsController {
    public async index({ auth, response }: HttpContextContract) {
        const user = await auth.use('api').authenticate();

        const isAdmin = user.$attributes['role'] === Role.ADMIN;

        const query = Product.query().orderBy('name', 'asc');
        if(!isAdmin) query.where('is_deleted', false);
        
        const products = await query;
        const formatedProducts = products.map((item) => {
            const payload = {
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
                isPerishable: item.isPerishable,
                expirationDate: item.expirationDate,
                batch: item.batch
            }
            
            return user.$attributes['role'] === Role.ADMIN ? { ...payload, deactivated: item.isDeleted } : payload;
        });
        
        return response.ok(formatedProducts);
    }

    public async show({ params, auth, response }: HttpContextContract) {
        const user = await auth.use('api').authenticate();

        const product = await Product.find(params.id);
        if ((!product || product.isDeleted) && user.$attributes['role'] !== Role.ADMIN) return response.notFound({ message: 'Product not found.' })

        return response.ok(product);
    }

    public async store({ request, response }: HttpContextContract) {
        const data = request.only(['name', 'description', 'price', 'stock', 'isPerishable', 'expirationDate', 'batch']);
        const product = await Product.create(data);
        
        return response.created(product);
    }

    public async update({ params, request, response }: HttpContextContract) {
        const product = await Product.find(params.id);
        if (!product || product.isDeleted) return response.notFound({ message: 'Product not found.' });

        const data = request.only(['name', 'stock', 'description', 'price', 'isPerishable', 'expirationDate', 'batch']);
        if(!data.isPerishable) {
            data.batch = null;
            data.expirationDate = null;
        }
        
        product.merge(data);
        await product.save();
        
        return response.ok(product);
    }

    public async logicalDelete({ params, response }: HttpContextContract) {
        const product = await Product.find(params.id);
        if (!product) return response.notFound({ message: 'Product not found.' });
            
        product.isDeleted = true;
        await product.save();

        return response.ok({ message: 'Product successfuly deleted.' });
    }

    public async reactivate({ params, response }: HttpContextContract) {
        const product = await Product.find(params.id);
        if (!product) return response.notFound({ message: 'Product not found.' });
            
        product.isDeleted = false;
        await product.save();

        return response.ok({ message: 'Product successfuly reactivated.' });
    }
}
