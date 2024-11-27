/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import fs from 'fs';
import { resolve } from 'path';

Route.group(() => {

  Route.group(() => {
    Route.post('/signup', 'UserController.signup').middleware('validation:userSignup')
    Route.post('/login', 'UserController.login').middleware(['validation:userLogin'])

    Route.get('/', 'UserController.show').middleware(['auth'])

    Route.get('/all', 'UserController.list').middleware(['auth', 'admin'])
    Route.delete('/destroy/:id', 'UserController.destroy').middleware(['auth', 'admin'])

    Route.post('/address', 'UserController.newAddress').middleware(['auth', 'validation:address'])
    Route.put('/address/:id', 'UserController.updateAddress').middleware(['auth', 'existingEntity:Address', 'validation:address'])
    Route.delete('/address/:id', 'UserController.deleteAddress').middleware(['auth', 'existingEntity:Address'])
  })
    .prefix('/users')

  Route.group(() => {
    Route.get('/', 'ProductsController.index')
    Route.get('/:id', 'ProductsController.show').middleware(['existingEntity:Product'])
    Route.post('/', 'ProductsController.store').middleware(['admin', 'validation:product'])
    Route.put('/:id', 'ProductsController.update').middleware(['admin', 'existingEntity:Product', 'validation:product'])
    Route.patch('/:id', 'ProductsController.logicalDelete').middleware(['admin', 'existingEntity:Product'])
    Route.patch('/reactivate/:id', 'ProductsController.reactivate').middleware(['admin', 'existingEntity:Product'])
  })
    .prefix('/products')
    .middleware(['auth'])

  Route.group(() => {
    Route.post('/:productId', 'SalesController.store').middleware(['validation:sale'])
    Route.get('/client', 'SalesController.index')
    Route.get('/client/:id', 'SalesController.show').middleware(['existingEntity:Sale'])
  })
    .prefix('/sales')
    .middleware(['auth'])

  //@ts-ignore
  Route.get('/docs', async ({ view }) => {
    const swaggerDocument = fs.readFileSync(resolve(__dirname, '../public/docs/swagger.yml'), 'utf8')
    return view.render('swagger', { swaggerDocument })
  })

}).prefix('/api')
