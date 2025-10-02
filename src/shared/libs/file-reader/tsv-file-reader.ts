import { readFileSync } from 'node:fs';
import { IFileReader } from './index.js';
import {
  TUserType,
  Facilities,
  IOffer,
  IOfferType,
} from '../../types/index.js';

export class TSVFileReader implements IFileReader {
  private rawData: string = '';

  constructor(private readonly filename: string) {}

  public read() {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): IOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          postDate,
          city,
          previewImageLink,
          offerImages,
          isPremium,
          isFavorite,
          rating,
          type,
          roomsAmount,
          guestsAmount,
          price,
          facilities,
          author,
          commentsLength,
          coordinates,
        ]) => ({
          title,
          description,
          postDate: new Date(postDate),
          city,
          previewImageLink,
          offerImages: offerImages.split(';'),
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: parseInt(rating, 10),
          type: type as IOfferType,
          roomsAmount: parseInt(roomsAmount, 10),
          guestsAmount: parseInt(guestsAmount, 10),
          price: parseInt(price, 10),
          facilities: facilities.split(';') as Facilities[],
          author: {
            name: author.split(';')[0],
            email: author.split(';')[1],
            profileImage: author.split(';')[2],
            password: author.split(';')[3],
            type: author.split(';')[4] as TUserType,
          },
          commentsLength: parseInt(commentsLength, 10),
          coordinates: {
            latitude: parseFloat(coordinates.split(';')[0]),
            longitude: parseFloat(coordinates.split(';')[1]),
          },
        })
      );
  }
}
