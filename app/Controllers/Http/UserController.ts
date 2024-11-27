import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import Address from 'App/Models/Address';
import Database from '@ioc:Adonis/Lucid/Database';

export default class UserController {
  public async signup({ request, response }: HttpContextContract) {
    const user = request.only(['name', 'birthDate', 'role', 'cpf', 'email', 'password']);
    try {
      await User.create(user);
      return response.created({ message: 'Successfuly created user!' });
    } catch (e: any) {
      console.log(e);
      if (e.errno === 1062) return response.conflict({ message: 'This user is already in use.' });

      return response.internalServerError({ message: 'An unexpected error occurred.' });
    }

  }

  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']);

    try {
      const user = await auth.use('api').verifyCredentials(email, password);

      await Database.from('sessions').where('user_id', user.id).delete();

      const token = await auth.use('api').generate(user, { expiresIn: '7days' });

      return response.ok({ token });
    } catch (e) {
      console.error(e);
      return response.unauthorized({ message: 'Invalid credentials.' });
    }
  }

  public async show({ auth, response }: HttpContextContract) {
    const authenticated = await auth.use('api').authenticate();
    const user = await User.find(authenticated.id);

    if(!user) {
      await auth.logout();
      return response.notFound({ message: 'User not found.' });
    }

    await user.load('addresses');
    const { name, email, cpf, addresses, birthDate } = user;

    return response.ok({
      name,
      email,
      cpf,
      birthDate,
      addresses
    });
  }

  public async list({ auth, response }: HttpContextContract) {
    const self = await auth.use('api').authenticate();
    const users = await User.query().whereNot('id', self.id).preload('addresses');
    const formatedUsers = users.map((item) => ({
      name: item.name,
      email: item.email,
      cpf: item.cpf,
      birthDate: item.birthDate,
      addresses: item.addresses
    }));

    response.ok(formatedUsers);
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const { id } = params;
    const user = await auth.use('api').authenticate();

    if(user.id === Number(id)) return response.badRequest({ message: 'Invalid operation.' });

    const userToDelete = await User.find(id);
    if(!userToDelete) return response.notFound({ message: 'User not found.' });

    await userToDelete.delete();

    return response.ok({ message: 'User was successfuly deleted.' });
  }

  public async newAddress({ auth, request, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate();
    const address = request.only(['street', 'city', 'state', 'zipCode', 'country']);

    await Address.updateOrCreate({
      zipCode: address.zipCode,
      userId: user.id
    }, address);

    return response.created({ message: 'Sucessfuly created address!' });
  }

  public async updateAddress({ auth, request, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate();
    const { id } = request.params();
    const address = request.only(['street', 'city', 'state', 'zipCode', 'country']);

    const existingAddress = await Address.find(id);
    if (!existingAddress) return response.notFound({ message: 'Address not found.' });

    if (existingAddress.userId !== user.id) return response.forbidden({ message: 'You are not allowed to perform this action.' });

    existingAddress.merge(address);
    await existingAddress.save();

    return response.ok({ message: 'Successfuly updated address!' });
  }

  public async deleteAddress({ auth, request, response }: HttpContextContract) {
    const { id } = request.params();
    const user = await auth.use('api').authenticate();

    const address = await Address.find(id);
    if (!address || address.userId !== user.id) return response.notFound({ message: 'Address not found.' });

    await address.delete();

    return response.ok({ message: 'Address successfuly deleted.' });
  }
}
