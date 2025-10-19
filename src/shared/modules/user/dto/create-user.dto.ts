import { TUserType } from '../../../types/user.type.js';

export class CreateUserDto {
  public name: string;
  public email: string;
  public profileImage: string;
  public password: string;
  public type: TUserType;
}
