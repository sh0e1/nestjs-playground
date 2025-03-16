import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { defineAccountFactory } from 'src/__generated__/fabbrica';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import configuration from 'src/config/configuration';

import { RepositoryError } from '../repository.error';
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findUnique', () => {
    test('should return the account if the record exists', async () => {
      const AccountFactory = defineAccountFactory();
      const {
        password: _password,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...expected
      } = await AccountFactory.create({
        name: 'Test Account',
        email: 'test@example.com',
        password: 'password',
      });

      const res = await accountRepository.findUnique({ id: expected.id });
      expect(res.isOk()).toBe(true);
      expect(res._unsafeUnwrap()).toEqual(expected);
    });

    test('should return null if the record does not exist', async () => {
      const res = await accountRepository.findUnique({ id: -1 });
      expect(res.isOk()).toBe(true);
      expect(res._unsafeUnwrap()).toBeNull();
    });

    test('should return the RepositoryError if an error occurs', async () => {
      const err = new Error('repository error');
      jest
        .spyOn(jestPrisma.client.account, 'findUnique')
        .mockRejectedValue(err);

      const res = await accountRepository.findUnique({ id: -1 });
      expect(res.isErr()).toBe(true);
      expect(res._unsafeUnwrapErr()).toStrictEqual(
        new RepositoryError('failed to find unique for account', {
          cause: err,
        }),
      );
    });
  });
});
