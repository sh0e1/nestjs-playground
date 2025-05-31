# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Run
- `npm run build` - Build the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start with debug mode and watch
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Testing
- `npm run test` - Run unit tests (uses .env.test)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:debug` - Run tests in debug mode

All test commands use `dotenv -e .env.test` to load test environment variables.

## Architecture Overview

This is a NestJS application with a clean architecture pattern using:

### Core Structure
- **Domain Layer** (`src/domain/`): Business logic and entities with repository interfaces
- **Service Layer** (`src/service/`): Application services implementing business use cases
- **Controller Layer** (`src/controller/`): HTTP endpoints and DTOs
- **Common Layer** (`src/common/`): Shared services (Prisma, Logger)

### Key Technologies
- **Database**: Prisma ORM with MySQL
- **Validation**: Zod schemas in domain layer + class-validator in controllers
- **Error Handling**: neverthrow library for functional error handling
- **Testing**: Jest with @quramy/jest-prisma-node for database testing
- **Password Hashing**: bcryptjs with salt rounds

### Module Organization
- Each feature has domain, service, and controller modules
- `CommonModule` exports shared services (PrismaService, LoggerService)
- `ControllerModule` aggregates all HTTP controllers
- Global configuration via `@nestjs/config`

### Database & Testing
- Uses Prisma with code generation to `__generated__/` directory
- Test environment uses separate database via `.env.test`
- Prisma Fabbrica for test data factories
- Database migrations in `prisma/migrations/`

### Domain Patterns
- Domain objects use Zod for validation (see `account.domain.ts`)
- Repository pattern with error handling using neverthrow
- Password validation regex enforces complexity requirements