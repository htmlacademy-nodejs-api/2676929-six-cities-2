import { ICoordinates } from './coordinates.type.js';
import { Facilities } from './facilities.enum.js';
import { IOfferType } from './offer-type.enum.js';
import { IUser } from './user.type.js';

export interface IOffer {
  title: string;
  description: string;
  postDate: Date;
  city: string;
  previewImageLink: string;
  offerImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: IOfferType;
  roomsAmount: number;
  guestsAmount: number;
  price: number;
  facilities: Facilities[];
  author: IUser;
  commentsLength: number;
  coordinates: ICoordinates;
}
