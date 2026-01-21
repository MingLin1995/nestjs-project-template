# GEMINI.md - AI Context for NestJS Project Template

## Preferred Tools

Use modern CLI tools for better efficiency:

| Task                  | Use            | Don't Use             |
| --------------------- | -------------- | --------------------- |
| Find files            | `fd`           | `find`, `ls -R`       |
| Search text           | `rg` (ripgrep) | `grep`, `ag`          |
| Interactive selection | `fzf`          | Manual filtering      |
| Process JSON          | `jq`           | `python -m json.tool` |

## Navigation

| Requirement                  | Section   | Description                                   |
| :--------------------------- | :-------- | :-------------------------------------------- |
| **Project Overview**         | Section 1 | Goals, tech stack, and structure              |
| **Dev Workflow**             | Section 2 | Starting env, DB changes, adding modules      |
| **Design Philosophy**        | Section 3 | Security, maintainability, production-ready   |
| **Module Deep Dive**         | Section 4 | Auth, Users, Logs, Pagination, Notifications  |
| **Database Design**          | Section 5 | Schema, migrations, and seeding               |
| **Collaboration (Required)** | Section 6 | Migration policy, communication, architecture |

---

## 1. Core Information

### 1.1 Overview

This project is a **NestJS 11.x Project Template** designed as an enterprise-grade foundation. It includes full authentication (JWT), Role-Based Access Control (RBAC), audit logging, and database integration.

### 1.2 Tech Stack

- **Runtime**: Bun 1.x
- **Framework**: NestJS 11.x (TypeScript 5.x)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7.x (v7.2.0)
- **Authentication**: Passport + JWT
- **Documentation**: Swagger (Auto-generated at `/apidoc`)
- **Containerization**: Docker + Docker Compose

### 1.3 Project Structure

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

---

## 2. Development Workflow

### 2.1 Starting the Environment

- **Command**: `bun run dev`
- **Logic**: Executes `dev.sh`, which cleans old containers and starts the service in `--build` mode.
- **Agent Note**: Code is mounted via Volumes; hot-reloading happens automatically inside the container. This command runs continuously. For further CLI interaction, execute it in the background (e.g., `bun run dev &`).

### 2.2 Database Changes

When modifying `prisma/schema.prisma`:

1. Edit the schema file.
2. Provide the migration command to the user (**DO NOT execute automatically**):
   `docker compose -f docker-compose.dev.yml exec app bunx prisma migrate dev --name <name>`
3. Run `prisma generate` if needed to sync the Client.

### 2.3 Adding New Modules

Use Nest CLI inside the container:
`docker compose -f docker-compose.dev.yml exec app nest g resource items`

---

## 3. Core Design Philosophy

### 3.1 Security & Authentication

- **Global JWT Protection**: All APIs require JWT by default. Use `@Public()` to skip.
- **Password Safety**: Uses `bcrypt` (10 rounds). Prisma queries automatically `omit` passwords.
- **RBAC**: Use `@Roles(Role.ADMIN)` to restrict access.

### 3.2 Maintainability

- **Unified Response**: `TransformInterceptor` wraps all returns. Controllers should only return the `data` portion.
- **Soft Delete**: Uses `ExtendedPrismaService`. DO NOT use raw `delete()`; mark `deletedAt` instead.
- **Validation**: Global `ValidationPipe` enforces DTO type checking.

---

## 4. Module Responsibilities

### 4.1 Authentication (Auth Module)

- **Guard Order**: `JwtAuthGuard` → `RolesGuard` → `Controller`.
- **Payload**: `{ "sub": "id", "account": "...", "role": "..." }`.

### 4.2 System Logging (Logger System)

- **Dual Channel**: Console (ERROR/WARN) + Database (Auditing).
- **Smart Interception**: `LoggingInterceptor` automatically records CUD operations, slow requests (>1s), and exceptions.

### 4.3 Request Lifecycle

```
Middleware → Guard → Interceptor (before) → Pipe → Controller → Service → Interceptor (after) → Filter
```

---

## 5. Database Design Highlights

- **User**: Includes `deletedAt` index for fast soft-delete queries.
- **SystemLog**: Supports multi-dimensional indexes (level, type, createdAt, userId).
- **Seed**: Use `prisma/seed.ts` to initialize admins and system configs.

---

## 6. Collaboration Guidelines (Golden Rules) - Agent MUST Follow

### 6.1 Execution Authority

- **Migration Consent**: **STRICTLY PROHIBITED** to execute `prisma migrate dev` automatically. You must provide the command for the user to run or get explicit consent.
- **Container Context**: All operational commands (nest, prisma, seed) MUST run via `docker compose exec app` inside the container.

### 6.2 Communication & Development Mode

- **Discuss First**: Follow the **Discuss -> Confirm -> Implement** workflow. Propose design specs and get approval before implementation.
- **Proactive Research**: If unsure about logic or a new package, the Agent **SHOULD** use web search tools to find best practices.

### 6.3 Code Quality

- **Reuse First**: Always check `src/common/` for existing Decorators/DTOs/Helpers before creating new ones.
- **Architectural Excellence**: Follow **SOLID** and **Decoupling** principles. For complex business logic, proactively recommend **Clean Architecture** or **DDD** patterns.
- **Flexibility**: Do not be rigid; suggest the most appropriate design pattern based on the project context.
