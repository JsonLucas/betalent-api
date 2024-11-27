import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Sale from './Sale'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description?: string

  @column()
  public price: number

  @column()
  public isDeleted: boolean

  @column() 
  public stock: number

  @column()
  public isPerishable: boolean

  @column()
  public expirationDate: Date

  @column()
  public batch: string

  @hasMany(() => Sale)
  public sales: HasMany<typeof Sale>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
