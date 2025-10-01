import { readFileSync } from "node:fs";
import { IFileReader } from "./file-reader.interface.ts";
import { IOffer } from "../../types/offer.type.ts";
import { IOfferType } from "../../types/offer-type.enum.ts";
import { Facilities } from "../../types/facilities.enum.ts";
import { TUserType } from "../../types/user.type.ts";

export class TSVFileReader implements IFileReader {
  private rawData: string = "";

  constructor(private readonly filename: string) {}

  public read() {
    this.rawData = readFileSync(this.filename, { encoding: "utf-8" });
  }

  public toArray(): IOffer[] {
    if (!this.rawData) {
      throw new Error("File was not read");
    }

    return this.rawData
      .split("\n")
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split("\t"))
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
          offerImages: offerImages.split(";"),
          isPremium: isPremium === "true" ? true : false,
          isFavorite: isFavorite === "true" ? true : false,
          rating: parseInt(rating),
          type: IOfferType[type as "HOUSE" | "APARTMENT" | "ROOM" | "HOTEL"],
          roomsAmount: parseInt(roomsAmount),
          guestsAmount: parseInt(guestsAmount),
          price: parseInt(price),
          facilities: facilities.split(";") as Facilities[],
          author: {
            name: author.split(";")[0],
            email: author.split(";")[1],
            profileImage: author.split(";")[2],
            password: author.split(";")[3],
            type: author.split(";")[4] as TUserType,
          },
          commentsLength: parseInt(commentsLength),
          coordinates: {
            latitude: parseInt(coordinates.split(";")[0]),
            longitude: parseInt(coordinates.split(";")[1]),
          },
        })
      );
  }
}
