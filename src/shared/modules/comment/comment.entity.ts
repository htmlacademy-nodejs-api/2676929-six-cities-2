import {
  defaultClasses,
  getModelForClass,
  ModelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@ModelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, trim: true })
  public text: string;

  @prop({ required: true })
  public postDate: Date;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true, ref: OfferEntity })
  public offerId: Ref<OfferEntity>;

  @prop({ required: true, ref: UserEntity })
  public authorId: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
