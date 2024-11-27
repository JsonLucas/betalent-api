import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    await this.down();
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).notNullable()
      table.boolean('is_deleted').defaultTo(false)
      table.boolean('is_perishable').defaultTo(false)
      table.date('expiration_date').nullable()
      table.text('batch').nullable()
      table.bigInteger('stock').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    });
  
    this.schema.raw(`
      CREATE TRIGGER enforce_perishable_constraints
      BEFORE INSERT ON products
      FOR EACH ROW
      BEGIN
        IF NEW.is_perishable = TRUE THEN
          IF NEW.expiration_date IS NULL OR NEW.batch IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Perecíveis devem ter data de validade e lote';
          END IF;
        ELSE
          IF NEW.expiration_date IS NOT NULL OR NEW.batch IS NOT NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Não perecíveis não podem ter data de validade ou lote';
          END IF;
        END IF;
      END;
    `);
  }

  public async down () {
    this.schema.dropTableIfExists(this.tableName);
  }
}
