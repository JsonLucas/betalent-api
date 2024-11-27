import { DateTime } from 'luxon';
import { BaseModel, column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { Role } from 'App/Enums/Role';
import Hash from '@ioc:Adonis/Core/Hash';
import Address from './Address';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public cpf: string
  
  @column()
  public birthDate: Date

  @column() 
  public role: Role

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
