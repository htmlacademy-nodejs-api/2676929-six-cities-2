export type TUserType = 'default' | 'pro';

export interface IUser {
  name: string;
  email: string;
  profileImage?: string;
  password: string;
  type: TUserType;
}
