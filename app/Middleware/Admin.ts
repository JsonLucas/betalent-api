import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Role } from 'App/Enums/Role'

export default class AdminMiddleware {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.use('api').user;
    
    if (user && user.$attributes['role'] !== Role.ADMIN) return response.forbidden({ message: 'You don\'t have permission to perform this action.' });
    
    await next()
  }
}
