import { Facilities, ICoordinates, OfferType } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  postDate: Date;
  city: string;
  previewImageLink: string;
  offerImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  type: OfferType;
  roomsAmount: number;
  guestsAmount: number;
  price: number;
  facilities: Facilities[];
  authorId: string;
  commentsLength: number;
  coordinates: ICoordinates;
}
