# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **NestJS** application implementing **Domain-Driven Design (DDD)** for a payment domain. The project provides a foundational architecture with generic base classes for rapid feature development following clean architecture principles.

## Technology Stack

- **Framework**: NestJS 11 with TypeScript 5.7
- **Database**: PostgreSQL 16 (via Docker)
- **ORM**: TypeORM 0.3 with `typeorm-naming-strategies` for snake_case convention
- **CQRS**: `@nestjs/cqrs` for command/query separation
- **Package Manager**: pnpm

## Development Commands

```bash
# Build
pnpm run build              # Compile TypeScript to dist/

# Development
pnpm run start:dev          # Watch mode (recommended for development)
pnpm run start:debug        # Debug mode with watch
pnpm run start:prod         # Production mode (node dist/main)

# Code Quality
pnpm run lint               # ESLint with auto-fix
pnpm run format             # Prettier formatting

# Testing
pnpm run test               # Unit tests (Jest)
pnpm run test:watch         # Jest in watch mode
pnpm run test:cov           # Coverage report
pnpm run test:e2e           # End-to-end tests
```

## Database Setup

Start PostgreSQL with Docker:

```bash
docker-compose up -d
```

Required environment variables (see `.env.example`):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `NODE_ENV` (development/staging/production/test)
- `PORT` (default: 3001)

## Architecture

### DDD Layered Structure

The project follows strict DDD layering with clear boundaries:

```
src/
├── common/                   # Shared utilities and types (cross-cutting concerns)
├── core/                     # Infrastructure (config, database)
└── payment/                  # Payment bounded context
    └── shared/
        ├── domain/           # Pure business logic (entities, VOs, repository interfaces)
        ├── infrastructure/   # Persistence implementation (TypeORM repositories, mappers)
        └── presentation/     # API response mapping (DTOs)
```

**Critical Rule**: The dependency direction must always flow **inward**:

- Infrastructure depends on Domain (interfaces)
- Presentation depends on Domain
- Domain has zero dependencies on outer layers

### Domain Layer Patterns

**BaseEntity** (`src/payment/shared/domain/base/base.entity.ts`)

- All entities extend this abstract class
- Extends NestJS CQRS `AggregateRoot` for event sourcing
- Factory methods: `create()` for new entities, `load()` for reconstitution from persistence
- Use `isNew()` to check if entity is not yet persisted

**ValueObject** (`src/payment/shared/domain/base/value-object.base.ts`)

- Immutable objects (props frozen with `Object.freeze()`)
- Override `validate()` hook for validation logic
- Equality via shallow comparison (not deep equality)

**Repository Interfaces** (`src/payment/shared/domain/types/domain-repository.type.ts`)

- `IBaseRepository<T>` defines the contract
- Use generic types: `ICreateEntity<T>`, `IPersistedEntity<T>`, `ILoadedEntity<T>`

### Infrastructure Layer

**BaseRepository** (`src/payment/shared/infrastructure/persistence/base/base.repository.ts`)

- Generic implementation of `IBaseRepository`
- Inject `TypeORM_ENTITY_TOKEN` for the entity type
- Methods: `save()`, `findOne()`, `find()`, `findWithPagination()`, `delete()`, `exists()`, `count()`

**BaseMapper** (`src/payment/shared/infrastructure/persistence/base/base.mapper.ts`)

- Bidirectional mapping between domain entities and TypeORM entities
- Auto-mapping with reflection - supports field inclusion/exclusion and custom transforms
- Use `toDomain()` and `toPersistence()` methods

**Database Entities** (`src/core/database/entities/`)

- Choose `BaseUUIDEntity` for UUID primary keys
- Choose `BaseIncrementEntity` for auto-increment IDs
- Both support soft deletes via `deletedAt` column

### Presentation Layer

**ResponseMapper** (`src/payment/shared/presentation/base/response-mapper.base.ts`)

- Abstract base for domain → DTO conversion
- Implement `toDto()` and `toDtoMany()` methods

## TypeORM Configuration

- Snake case naming strategy (PostgreSQL convention)
- Timezone-aware timestamps (`timestamptz`)
- Soft deletes enabled globally
- SSL support for production (controlled by `DB_SSL` env var)
- Migrations are disabled (synchronize: false) - schema changes should be managed via migrations

## Dependency Injection

Repository tokens are defined as Symbols (e.g., `PRODUCT_REPOSITORY_TOKEN`) in:

- `src/payment/shared/infrastructure/persistence/constants/repository.tokens.ts`

When creating new bounded contexts, follow this pattern for DI tokens.

## Path Aliases

Use `@/*` for imports from `src/`:

```typescript
import { BaseEntity } from '@/payment/shared/domain/base/base.entity';
```

## Key Architectural Rules

1. **Never import from infrastructure in domain** - Domain must remain pure
2. **Factory methods over constructors** - Use `Entity.create()` and `Entity.load()`
3. **Value objects are immutable** - Always create new instances instead of modifying
4. **Repository interfaces in domain, implementations in infrastructure** - Dependency inversion
5. **Mappers for layer boundaries** - Always use mappers between domain and persistence
