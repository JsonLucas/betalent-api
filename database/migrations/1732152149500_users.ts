import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Role } from 'App/Enums/Role'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    await this.down();
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.date('birth_date').notNullable()
      table.string('cpf', 11).notNullable().unique()
      table.enum('role', Object.keys(Role)).defaultTo('CLIENT')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    });
  }

  public async down () {
    this.schema.dropTableIfExists(this.tableName)
  }
}
