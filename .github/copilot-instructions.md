# GitHub Copilot Instructions

This file provides context and guidance for GitHub Copilot when working with this NestJS repository.

## Development Workflow

### Building and Running
- Use `npm run build` to compile the TypeScript application
- Use `npm run start:dev` for development with hot-reload watch mode
- Use `npm run start:debug` for debugging with watch mode enabled
- Always run `npm run lint` before committing (ESLint with auto-fix)
- Use `npm run format` to format code with Prettier

### Testing
- Run `npm run test` for unit tests (automatically loads `.env.test`)
- Run `npm run test:watch` for interactive test development
- Run `npm run test:cov` to generate coverage reports
- Run `npm run test:e2e` for end-to-end integration tests
- Run `npm run test:debug` for debugging test failures

All test commands use `dotenv -e .env.test` to load test-specific environment variables.

## Architecture

This is a NestJS application following clean architecture principles with clear separation of concerns:

### Layer Structure
- **Domain Layer** (`src/domain/`): Core business logic, entities, and repository interfaces
  - Contains domain models with Zod validation schemas
  - Defines repository interfaces for data access
  - Implements domain-specific error handling
  
- **Service Layer** (`src/service/`): Application services implementing business use cases
  - Orchestrates domain logic and repository calls
  - Returns results using neverthrow for functional error handling
  
- **Controller Layer** (`src/controller/`): HTTP endpoints and request/response DTOs
  - Uses class-validator for request validation
  - Transforms domain results to HTTP responses
  
- **Common Layer** (`src/common/`): Shared infrastructure services
  - PrismaService for database access
  - LoggerService for application logging

### Technology Stack
- **Framework**: NestJS with TypeScript
- **Database**: MySQL via Prisma ORM
- **Validation**: Zod schemas (domain) + class-validator (controllers)
- **Error Handling**: neverthrow library for Result types
- **Testing**: Jest with @quramy/jest-prisma-node for database testing
- **Security**: bcryptjs for password hashing with configurable salt rounds

### Module Organization
- Each feature typically has three modules: domain, service, and controller
- `CommonModule` exports shared services (PrismaService, LoggerService)
- `ControllerModule` aggregates all HTTP controllers
- Configuration managed globally via `@nestjs/config`

## Database and Testing

### Prisma Setup
- Prisma generates code to `__generated__/` directory (gitignored)
- Database schema defined in `prisma/schema.prisma`
- Migrations stored in `prisma/migrations/`
- Use Prisma Fabbrica for test data factories

### Test Environment
- Tests use a separate database configured in `.env.test`
- Database is automatically reset between test suites
- Mock data created using Prisma Fabbrica factories

## Domain Patterns

### Validation
- Domain entities use Zod schemas for validation (see `account.domain.ts`)
- Controllers use class-validator decorators for request validation
- Password validation enforces complexity via regex patterns

### Error Handling
- Repository methods return `Result<T, RepositoryError>` from neverthrow
- Service methods propagate Results for functional error handling
- Controllers transform Results into appropriate HTTP responses

### Repository Pattern
- Domain layer defines repository interfaces
- Repositories use Prisma for data access
- All database operations return Results instead of throwing exceptions

## Code Style

- Follow existing patterns when adding new features
- Keep layers separated: domain → service → controller
- Use neverthrow Results for error handling, avoid throwing exceptions
- Validate at boundaries: Zod in domain, class-validator in controllers
- Write tests for new business logic using existing test patterns
