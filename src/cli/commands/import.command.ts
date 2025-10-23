import {
  createOffer,
  getErrorMessage,
  getMongoURI,
} from '../../shared/helpers/index.js';
import { IDatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { ILogger } from '../../shared/libs/logger/logger.interface.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { IOfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { IUserService } from '../../shared/modules/user/user-service.interface.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';
import { IOffer } from '../../shared/types/offer.type.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { ICommand } from './command.interface.js';

export class ImportCommand implements ICommand {
  private userService: IUserService;
  private offerService: IOfferService;
  private databaseClient: IDatabaseClient;
  private logger: ILogger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: IOffer) {
    const user = await this.userService.findOrCreate(
      {
        ...offer.author,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt
    );

    await this.offerService.create({
      authorId: user.id,
      title: offer.title,
      description: offer.description,
      isFavorite: offer.isFavorite,
      isPremium: offer.isPremium,
      previewImageLink: offer.previewImageLink,
      offerImages: offer.offerImages,
      price: offer.price,
      roomsAmount: offer.roomsAmount,
      guestsAmount: offer.guestsAmount,
      city: offer.city,
      commentsLength: offer.commentsLength,
      rating: offer.rating,
      type: offer.type,
      postDate: offer.postDate,
      facilities: offer.facilities,
      coordinates: offer.coordinates,
    });
  }

  public async execute(
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
