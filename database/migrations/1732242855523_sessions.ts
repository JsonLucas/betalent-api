import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sessions'

  public async up() {
    await this.down();
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.dateTime('expires_at').notNullable()
      table.string('name', 255).notNullable()
      table.string('token').notNullable(),
      table.string('type', 255).notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
