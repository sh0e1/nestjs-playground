import { PrismaService } from 'src/common/prisma/prisma.service';

export class RepositoryError extends Error {
  private code: RepositoryErrorCode;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'RepositoryError';
    this.code = RepositoryErrorCode.Internal;

    switch (true) {
      case PrismaService.isNotFoundError(options?.cause):
        this.code = RepositoryErrorCode.NotFound;
        break;
    }
  }

  static isNotFoundError(e: unknown): boolean {
    return (
      e instanceof RepositoryError && e.code === RepositoryErrorCode.NotFound
    );
  }
}

const RepositoryErrorCode = {
  NotFound: 'NotFound',
  Internal: 'Internal',
};
type RepositoryErrorCode =
  (typeof RepositoryErrorCode)[keyof typeof RepositoryErrorCode];
