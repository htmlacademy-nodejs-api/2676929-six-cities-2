import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { IConfig } from './config.interface.js';
import { configRestSchema, RestSchema } from './rest.schema.js';
import { config } from 'dotenv';

@injectable()
export class RestConfig implements IConfig<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error("Can't read .env file");
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
