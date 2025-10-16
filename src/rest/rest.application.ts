import { inject, injectable } from 'inversify';
import { ILogger } from '../shared/libs/logger/logger.interface.js';
import { Component } from '../shared/types/index.js';
import { IConfig } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $Port: ${this.config.get('PORT')}`);
  }
}
