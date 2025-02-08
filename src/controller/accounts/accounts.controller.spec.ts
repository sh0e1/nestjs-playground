import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from 'src/config/configuration';
import { AccountServiceModule } from 'src/service/account/account.service.module';

import { AccountsController } from './accounts.controller';

describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountServiceModule,
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
      controllers: [AccountsController],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
