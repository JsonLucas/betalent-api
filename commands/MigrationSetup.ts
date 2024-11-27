import { BaseCommand } from '@adonisjs/core/build/standalone'
import knex from 'knex'
import 'dotenv/config'

export default class MigrationSetup extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'migration:setup'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Verifica se o banco de dados existe, cria-o e executa as migrações'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const knexClient = knex({
      client: 'mysql2',
      connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: Number(process.env.MYSQL_PORT) || 3306,
      },
    })

    const databaseName = process.env.MYSQL_DB_NAME

    try {
      const result = await knexClient.raw(`SHOW DATABASES LIKE '${databaseName}'`)
      if (result[0].length === 0) {
        console.log(`Database '${databaseName}' not found. Creating...`)

        await knexClient.raw(`CREATE DATABASE ${databaseName}`)
        console.log(`Database '${databaseName}' created successfully!`)

      } else {
        console.log(`Database '${databaseName}' already exists.`)
      }
    } catch (error) {
      console.error('Error checking or creating database:', error)
      
    } finally {
      knexClient.destroy()
    }
  }
}
