# GEMINI.md - AI Context for NestJS Project Template

## Project Overview

This is a comprehensive **NestJS Project Template** designed to speed up backend development. It includes pre-built authentication (JWT), user management, role-based access control (RBAC), and database integration with Prisma.

## tech Stack

- **Runtime**: Bun 1.x
- **Framework**: NestJS 11.x (TypeScript 5.x)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7.x (v7.2.0)
- **Authentication**: Passport + JWT
- **Documentation**: Swagger (Auto-generated)
- **Containerization**: Docker + Docker Compose

## Repository Structure

```
nestjs-project-template/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   ├── auth/                      # Authentication logic (JWT strategies, guards)
│   ├── users/                     # User management (CRUD, soft delete)
│   ├── common/                    # Shared resources
│   │   ├── decorators/            # Custom decorators (@Roles, @Public)
│   │   ├── guards/                # Guards (RolesGuard)
│   │   ├── filters/               # Exception filters
│   │   ├── interceptors/          # Response interceptors
│   │   └── prisma/                # Prisma extended service
│   └── prisma/
│       ├── schema.prisma          # Database schema
│       └── seed.ts                # Database seeder
├── .env.example                   # Environment variable template
├── docker-compose.dev.yml         # Dev environment definition
└── package.json                   # Scripts and dependencies
```

## Key Commands

| Action              | Command                   | Description                          |
| :------------------ | :------------------------ | :----------------------------------- |
| **Start Dev**       | `bun run dev`             | Starts app in dev mode (uses Docker) |
| **Deploy**          | `./deploy.sh`             | Deploys to production                |
| **Prisma Migrate**  | `bun run prisma:migrate`  | Runs DB migrations during dev        |
| **Prisma Generate** | `bun run prisma:generate` | Generates Prisma client              |
| **Test**            | `bun run test`            | Runs unit tests                      |
| **Lint**            | `bun run lint`            | Runs linter                          |

## Development Workflows

### 1. Starting the Environment

- **Primary Command**: `bun run dev`
- **Internal Logic**: Runs `dev.sh`, which stops old containers and starts the dev environment via `docker-compose.dev.yml --build`.
- **Hot Reload**: Source code is mounted via volumes; changes in `src/` trigger automatic rebuilds within the container.

### 2. Database Changes

When modifying `prisma/schema.prisma`:

1. Edit the schema file.
2. Run migration: `docker compose -f docker-compose.dev.yml exec app bunx prisma migrate dev --name <migration_name>`
3. Restart app if needed (though `bun run dev` usually handles this).
4. **Agent Tip**: Always use the `manage_database` skill if available.

### 3. Adding a New Module

1. Use Nest CLI: `nest g resource <name>` inside the container.
2. Example: `docker compose -f docker-compose.dev.yml exec app nest g resource items`

### 4. Authentication & Roles

- Use `@Public()` to make an endpoint public.
- Use `@Roles(Role.ADMIN)` to restrict access to Admins.
- Current User: Access via `@Request() req` -> `req.user`.

## Critical Patterns & Conventions

### 1. Database & Soft Delete

- **Service**: Use `ExtendedPrismaService` (inherited from `PrismaService` but with extensions).
- **Behavior**: All models with a `deletedAt` field support soft delete.
- **Rule**: Never use the raw `this.prisma.user.delete()`. The extension automatically converts `delete` and `deleteMany` to `update` with `deletedAt`. Queries automatically filter out `deletedAt !== null`.

### 2. Unified Response Format

- **Interceptor**: `TransformInterceptor` wraps all controller returns.
- **Format**: `{ statusCode, message, data, timestamp }`.
- **Controller Rule**: Simply return the `data`. Do not manually wrap responses unless specifically instructed.

### 3. Validation & DTOs

- **Location**: Use `src/<module>/dto/` folders.
- **Library**: Use `class-validator` and `class-transformer` decorators.
- **Pipes**: `ValidationPipe` is enabled globally with `whitelist: true` and `forbidNonWhitelisted: true`.

### 4. Logging

- Use the built-in `LoggerService` for application logs.
- Request/Error logs are automatically persisted to the `SystemLog` table via `LoggingInterceptor` and `HttpExceptionFilter`.

## How to Work with AI Agents

When asking an agent to perform tasks:

- **Database**: Use the `manage_database` skill for migrations and seeds.
- **Context**: The agent should always check `GEMINI.md` before starting a new feature to ensure pattern compliance.

## Collaboration Guidelines (Golden Rules)

1.  **Migration Consent**: The agent **MUST NOT** execute database migration commands (`prisma migrate dev`) automatically. Instead, provide the command to the user for manual execution or ask for explicit confirmation before running.
2.  **Specifications First**: Follow a **Discuss -> Confirm -> Implement** workflow. Always discuss the technical design and specifications with the user first. Start implementation ONLY after the user has confirmed the plan.
3.  **Consistency & Reuse**: Before creating new utilities or decorators, **ALWAYS** check `src/common/` to see if a similar solution already exists. Maintain a consistent coding style with the rest of the project.
4.  **Architectural Excellence**:
    - **SOLID Principles**: Always strive for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
    - **Decoupling**: Minimize direct dependencies between modules to ensure maintainability.
    - **Advanced Patterns**: When facing high complexity, prioritize **Clean Architecture** or **Domain-Driven Design (DDD)** patterns—or suggest other superior alternatives—to keep the business logic isolated and testable.
    - **Future-Proofing**: Avoid "quick fixes" that increase technical debt. Design for long-term maintenance.
5.  **Proactive Research**: When encountering unfamiliar libraries or complex business logic, the agent **SHOULD** use web search tools to find best practices or clarify requirements before proposing a solution.
6.  **Maintain Flexibility**: Architecture should serve the project, not just follow a formula. Always be open to better design suggestions that fit the specific context.
