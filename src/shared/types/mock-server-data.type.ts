import { ICoordinates } from './coordinates.type.js';

export interface IMockServerData {
  titles: string[];
  descriptions: string[];
  offerImages: string[];
  names: string[];
  emails: string[];
  profileImages: string[];
  passwords: string[];
  coordinates: ICoordinates[];
}
