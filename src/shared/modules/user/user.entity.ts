import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { IUser, TUserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/hash.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements IUser {
  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: false, default: '' })
  public profileImage: string;

  @prop({ required: true, default: '' })
  private password?: string;

  @prop({ required: true, default: '' })
  public type: TUserType;

  constructor(userData: IUser) {
    super();

    this.email = userData.email;
    this.profileImage = userData.profileImage;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
