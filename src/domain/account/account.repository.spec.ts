import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { defineAccountFactory } from 'src/__generated__/fabbrica';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import configuration from 'src/config/configuration';

import { AccountRepository } from './account.repository';

describe('AccountRepository', () => {
  let accountRepository: AccountRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CommonModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [AccountRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(jestPrisma.client)
      .compile();

    accountRepository = moduleRef.get(AccountRepository);
  });

  describe('findUnique', () => {
    test('should return an account if the record exists', async () => {
      const AccountFactory = defineAccountFactory();
      const account = await AccountFactory.create({
        name: 'Test Account',
        email: 'test@example.com',
        password: 'password',
      });

      const res = await accountRepository.findUnique({ id: account.id });
      expect(res.isOk()).toBe(true);
      expect(res._unsafeUnwrap()).toEqual({
        id: account.id,
        name: account.name,
        email: account.email,
      });
    });
  });
});
