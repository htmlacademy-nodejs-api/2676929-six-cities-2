import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Facilities, ICoordinates, OfferType } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, default: '', trim: true })
  public title: string;

  @prop({ required: true, unique: true, trim: true })
  public description: string;

  @prop({ required: true, default: '' })
  public postDate: Date;

  @prop({ required: true })
  public city: string;

  @prop({ required: true, default: '' })
  public previewImageLink: string;

  @prop({ required: true, default: '' })
  public offerImages: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, default: false })
  public isFavorite: boolean;

  @prop({ required: true, default: 1 })
  public rating: number;

  @prop({ required: true, type: () => String, enum: OfferType })
  public type: OfferType;

  @prop({ required: true, default: 1 })
  public roomsAmount: number;

  @prop({ required: true, default: 1 })
  public guestsAmount: number;

  @prop({ required: true, default: 1 })
  public price: number;

  @prop({ required: true, default: [] })
  public facilities: Facilities[];

  @prop({ required: true, ref: UserEntity })
  public authorId: Ref<UserEntity>;

  @prop({ required: true, default: 0 })
  public commentsLength: number;

  @prop({ required: true })
  public coordinates: ICoordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
