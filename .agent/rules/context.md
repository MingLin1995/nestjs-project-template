---
trigger: always_on
---

# Project Context

This project is a **NestJS 11.x Project Template** designed as an enterprise-grade foundation.

## Tech Stack

- Runtime: Bun 1.x
- Framework: NestJS 11.x (TypeScript 5.x)
- Database: PostgreSQL 16
- ORM: Prisma 7.x (v7.2.0)
- Authentication: Passport + JWT
- Documentation: Swagger (Auto-generated at `/apidoc`)
- Containerization: Docker + Docker Compose

## Project Structure

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
