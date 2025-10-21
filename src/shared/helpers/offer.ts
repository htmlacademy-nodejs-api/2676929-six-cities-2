import { Facilities, IOffer, OfferType, TUserType } from '../types/index.js';

const parseAuthor = (author: string) => ({
  name: author.split(';')[0],
  email: author.split(';')[1],
  profileImage: author.split(';')[2],
  type: author.split(';')[3] as TUserType,
});

const parseCoordinates = (coordinates: string) => ({
  latitude: parseFloat(coordinates.split(';')[0]),
  longitude: parseFloat(coordinates.split(';')[1]),
});

export function createOffer(offerData: string): IOffer {
  const [
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
  ] = offerData.replace('\n', '').split('\t');

  return {
    title,
    description,
    postDate: new Date(postDate),
    city,
    previewImageLink,
    offerImages: offerImages.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseInt(rating, 10),
    type: OfferType[type as 'House' | 'Room' | 'Apartment' | 'Hotel'],
    roomsAmount: parseInt(roomsAmount, 10),
    guestsAmount: parseInt(guestsAmount, 10),
    price: parseInt(price, 10),
    facilities: facilities.split(';') as Facilities[],
    author: parseAuthor(author),
    commentsLength: parseInt(commentsLength, 10),
    coordinates: parseCoordinates(coordinates),
  };
}
