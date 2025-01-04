import { RepositoryError } from 'src/domain/repository.error';
import { ZodError } from 'zod';

export class ServiceError extends Error {
  private code: ServiceErrorCode;

  constructor(message: string, options?: ServiceErrorOptions) {
    super(message, options);

    this.name = 'ServiceError';
    this.code = options?.code ?? ServiceErrorCode.Internal;

    switch (true) {
      case RepositoryError.isNotFoundError(options?.cause):
        this.code = ServiceErrorCode.NotFound;
        break;
      case options?.cause instanceof ZodError:
        this.code = ServiceErrorCode.InvalidArgument;
        break;
      case options?.cause instanceof ServiceError:
        this.code = options?.cause.code;
        break;
    }
  }

  static AlreadyExists(message: string, options?: ErrorOptions): ServiceError {
    return new ServiceError(message, {
      code: ServiceErrorCode.AlreadyExists,
      ...options,
    });
  }
}

interface ServiceErrorOptions extends ErrorOptions {
  code?: ServiceErrorCode;
}

const ServiceErrorCode = {
  InvalidArgument: 'InvalidArgument',
  NotFound: 'NotFound',
  AlreadyExists: 'AlreadyExists',
  Internal: 'Internal',
};
type ServiceErrorCode =
  (typeof ServiceErrorCode)[keyof typeof ServiceErrorCode];
