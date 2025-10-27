import { inject, injectable } from 'inversify';
import { IOfferService } from './offer-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { ILogger } from '../../libs/logger/logger.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import mongoose from 'mongoose';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created ${dto.title}`);

    return result;
  }

  public async findById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    const [offer] = await this.offerModel
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(offerId),
          },
        },
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
              { $project: { rating: 1 } },
            ],
            as: 'comments',
          },
        },
        {
          $addFields: {
            rating: {
              $ifNull: [{ $avg: '$comments.rating' }, 0],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  email: 1,
                  name: 1,
                  isPro: 1,
                  profileImage: 1,
                },
              },
            ],
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .exec();

    return offer;
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
              { $project: { rating: 1 } },
            ],
            as: 'comments',
          },
        },
        {
          $addFields: {
            rating: {
              $ifNull: [{ $avg: '$comments.rating' }, 0],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            pipeline: [
              { $project: { email: 1, name: 1, isPro: 1, profileImage: 1 } },
            ],
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .exec();
  }

  public async updateById(
    dto: CreateOfferDto,
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('userId')
      .exec();
  }

  public async deleteById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async incCommentLength(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsLength: 1,
        },
      })
      .exec();
  }

  public async findCityPremium(
    city: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .populate('userId')
      .exec();
  }
}
