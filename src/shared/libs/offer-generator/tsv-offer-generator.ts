import dayjs from 'dayjs';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import {
  Cities,
  Facilities,
  ICoordinates,
  IMockServerData,
  OfferType,
} from '../../types/index.js';
import { IOfferGenerator } from './offer-generator.interface.js';

const parseCoordinatesToString = (coordinates: ICoordinates): string => {
  return `${coordinates.latitude};${coordinates.longitude}`;
};

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_COMMENTS_LENGTH = 0;
const MAX_COMMENTS_LENGTH = 20;

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: IMockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem([
      Cities.AMSTERDAM,
      Cities.BRUSSELS,
      Cities.COLOGNE,
      Cities.DUSSELDORF,
      Cities.HAMBURG,
      Cities.PARIS,
    ]);
    const previewImageLink = getRandomItem<string>(this.mockData.offerImages);
    const offerImages = this.mockData.offerImages.join(';');
    const isPremium = Boolean(generateRandomValue(0, 1));
    const isFavorite = Boolean(generateRandomValue(0, 1));
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem([
      OfferType.Apartment,
      OfferType.Hotel,
      OfferType.House,
      OfferType.Room,
    ]);
    const roomsAmount = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guestsAmount = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const facilities = getRandomItems([
      Facilities.AIR_CONDITIONING,
      Facilities.BABY_SEAT,
      Facilities.BREAKFAST,
      Facilities.FRIDGE,
      Facilities.LAPTOP_FRIENDLY,
      Facilities.TOWELS,
      Facilities.WASHER,
    ]).join(';');
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const profileImage = getRandomItem<string>(this.mockData.profileImages);
    const password = getRandomItem<string>(this.mockData.passwords);
    const userType = getRandomItem<string>(['default', 'pro']);
    const commentsLength = generateRandomValue(
      MIN_COMMENTS_LENGTH,
      MAX_COMMENTS_LENGTH
    );
    const coordinates = parseCoordinatesToString(
      getRandomItem<ICoordinates>(this.mockData.coordinates)
    );

    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const author = `${name};${email};${profileImage};${password};${userType}`;

    return [
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
    ].join('\t');
  }
}
