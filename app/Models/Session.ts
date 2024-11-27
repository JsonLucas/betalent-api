import { DateTime } from 'luxon'
import { column, BaseModel, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public expiresAt: DateTime

  @column()
  public name: string

  @column()
  public token: string

  @column()
  public type: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
