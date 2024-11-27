import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Sale from 'App/Models/Sale';
import Product from 'App/Models/Product';

export default class SalesController {
    public async store({ params, auth, request, response }: HttpContextContract) {
        const user = await auth.use('api').authenticate();
        const { productId } = params;
        const { quantity } = request.body();

        const product = await Product.find(productId);
        if (!product || product.isDeleted) return response.notFound({ message: 'Product not found.' });

        if (product.stock - quantity < 0) return response.badRequest({ message: 'Insufficient stock.' });

        const unitPrice = product.price;
        const totalPrice = unitPrice * quantity;

        await Sale.create({
            userId: user.id,
            productId,
            quantity,
            unitPrice,
            totalPrice,
        });

        product.merge({ stock: product.stock - quantity });
        await product.save();

        return response.created({ message: 'Sale was successfuly created.' });
    }


    public async index({ auth, request, response }: HttpContextContract) {
        const user = await auth.use('api').authenticate();

        const { month, year } = request.qs();

        const query = Sale.query().where('user_id', user.id).orderBy('created_at', 'desc');
        if (month && year) {
            query.whereRaw('EXTRACT(MONTH FROM created_at) = ?', [month]);
            query.whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year]);
        }

        const sales = await query.preload('product');
        const formatedSale = sales.map((item) => this.formatSalePayload(item));

        return response.ok(formatedSale);
    }


    public async show({ params, auth, response }: HttpContextContract) {
        const user = await auth.use('api').authenticate();

        const sale = await Sale.query()
            .where('id', params.id)
            .andWhere('user_id', user.id)
            .preload('product')
            .first();

        if (!sale) return response.notFound({ message: 'Sale not found.' });

        const formatedSale = this.formatSalePayload(sale);
        return response.ok(formatedSale);
    }

    private formatSalePayload(payload: Sale) {
        return {
            id: payload.id,
            quantity: payload.quantity,
            unitPrice: payload.unitPrice,
            total: payload.totalPrice,
            createdAt: payload.createdAt,
            product: {
                id: payload.product.id,
                price: payload.product.price,
                name: payload.product.name,
                description: payload.product.description,
                stock: payload.product.stock
            }
        }
    }
}
