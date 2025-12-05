# NestJS Project Template

NestJS 專案模板，提供開箱即用的身份驗證、用戶管理、角色權限控制等核心功能，可快速開始新的後端專案

**快速執行開發環境**：

0. 安裝 Bun `curl -fsSL https://bun.sh/install | bash`
1. 執行 `bun run dev`
2. 訪問 http://localhost:3000/apidoc 查看 Swagger 文檔
3. 測試使用預設管理員帳號 `admin001 / 000000` 登入

**快速執行生產環境**：

1. 編輯 .env
2. 執行 `bun run deploy`

## 特色功能

- **身份驗證系統** - JWT 認證，全域守衛保護
- **用戶管理** - CRUD 操作，軟刪除支援
- **角色權限控制** - 基於裝飾器的 RBAC (Role-Based Access Control)
- **資料庫 ORM** - Prisma 6.x + PostgreSQL 15
- **API 文檔** - Swagger 自動生成
- **Docker 支援** - 開發/生產環境分離
- **通知系統** - Email/SMS/LINE 整合（可選）

## 技術棧

| 類別     | 技術                         |
| -------- | ---------------------------- |
| Runtime  | Bun 1.x                      |
| 框架     | NestJS 10.x + TypeScript 5.x |
| 資料庫   | PostgreSQL 15 + Prisma 6.x   |
| 認證     | JWT + Passport               |
| API 文檔 | Swagger                      |
| 容器化   | Docker + Docker Compose      |

## 專案建立流程

### 前置需求

- Docker & Docker Compose
- Git

### 1. 複製模板專案

```bash
# 複製專案模板
git clone
```

### 2. 環境設定

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env，設定資料庫連線和 JWT 密鑰等等資訊
vim .env
```

### 3. 是否啟用通知相關功能

專案內建通知模組，支援：Email、SMS、LINE Bot

- 目前程式碼已清理並準備好使用，但預設為註解狀態
- 相關檔案：.env、app.module.ts、notifications/

### 4. 啟動開發環境

```bash
# 直接啟動（Docker 會自動處理依賴安裝）
bun run dev
```

### 5. 測試 API

```bash
# 健康檢查
curl http://localhost:3000

# 登入（使用預設管理員帳號）
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"admin001","password":"000000"}'

# 取得當前用戶資訊（需要 JWT token）
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer <your-token>"
```

## 專案結構

```
nestjs-project-template/
├── src/
│   ├── main.ts                    # 應用入口點
│   ├── app.module.ts              # 主模組
│   │
│   ├── auth/                      # 身份驗證模組
│   │   ├── auth.controller.ts     # 登入/註冊邏輯
│   │   ├── auth.module.ts         # 身份驗證模組定義
│   │   ├── auth.service.ts        # 登入/註冊業務邏輯
│   │   ├── jwt-auth.guard.ts      # JWT 全域守衛
│   │   ├── jwt.strategy.ts        # Passport JWT 策略
│   │   ├── dto/                   # 資料傳輸物件
│   │   │   └── auth.dto.ts
│   │   └── interfaces/            # 身份驗證相關介面
│   │       └── auth.interface.ts
│   │
│   ├── users/                     # 用戶管理模組
│   │   ├── users.controller.ts    # 用戶相關 API 端點
│   │   ├── users.module.ts        # 用戶模組定義
│   │   ├── users.service.ts       # 用戶 CRUD（含軟刪除）
│   │   └── dto/                   # 資料傳輸物件
│   │       ├── user-query.dto.ts
│   │       └── user.dto.ts
│   │
│   ├── common/                    # 共用資源
│   │   ├── decorators/            # 自定義裝飾器
│   │   │   ├── public.decorator.ts   # @Public() - 跳過 JWT
│   │   │   └── roles.decorator.ts    # @Roles() - 角色權限
│   │   ├── dto/                   # 共用資料傳輸物件
│   │   │   ├── paginated-response.dto.ts
│   │   │   └── pagination.dto.ts
│   │   ├── filters/               # 例外處理過濾器
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/                # 守衛
│   │   │   └── roles.guard.ts        # 角色權限守衛
│   │   ├── interceptors/          # 攔截器
│   │   │   └── logging.interceptor.ts
│   │   ├── logger/                # 客戶端日誌服務
│   │   │   ├── logger.module.ts
│   │   │   └── logger.service.ts
│   │   └── utils/                 # 共用工具函數
│   │       ├── mask-sensitive.helper.ts
│   │       └── pagination.helper.ts
│   │
│   ├── logs/                      # 系統日誌模組
│   │   ├── logs.controller.ts
│   │   ├── logs.module.ts
│   │   ├── logs.service.ts
│   │   └── dto/
│   │       ├── log-query.dto.ts
│   │       └── log-response.dto.ts
│   │
│   └── notifications/             # 通知模組（可選）
│       ├── notifications.module.ts
│       ├── notifications.service.ts
│       ├── interfaces/            # 通知相關介面
│       │   └── notification.interface.ts
│       ├── services/              # 各類通知服務
│       │   ├── email-notification.service.ts
│       │   ├── line-notification.service.ts
│       │   └── sms-notification.service.ts
│       └── templates/             # 通知模板
│
├── prisma/
│   ├── schema.prisma              # 資料庫 Schema
│   └── seed.ts                    # 種子資料（初始化管理員帳號）
│
├── docker-compose.dev.yml         # 開發環境 Docker Compose 配置
├── docker-compose.yml             # 生產環境 Docker Compose 配置
├── Dockerfile.dev                 # 開發環境 Dockerfile
├── Dockerfile.prod                # 生產環境 Dockerfile
├── docker-entrypoint.sh           # 容器啟動腳本
│
└── .env.example                   # 環境變數範本
```

## 核心功能說明

### 身份驗證

**JWT Payload**：

```json
{
  "sub": "<user-id>",
  "account": "user001",
  "role": "USER"
}
```

### 用戶管理

**API 端點**：

| 方法   | 路徑       | 權限     | 說明               |
| ------ | ---------- | -------- | ------------------ |
| GET    | /users/me  | 登入用戶 | 取得當前用戶資訊   |
| PATCH  | /users/me  | 登入用戶 | 更新當前用戶資訊   |
| GET    | /users     | ADMIN    | 取得所有用戶列表   |
| GET    | /users/:id | ADMIN    | 取得特定用戶資訊   |
| PATCH  | /users/:id | ADMIN    | 更新特定用戶資訊   |
| DELETE | /users/:id | ADMIN    | 刪除用戶（軟刪除） |

**軟刪除機制**：

- 刪除用戶時設定 `deletedAt` 時間戳，而非真正刪除
- 所有查詢自動過濾已刪除的用戶
- 已刪除的帳號可以重新註冊（會恢復並更新資料）

### 角色權限控制

使用 `@Roles()` 裝飾器限制 API 存取：

```typescript
import { Roles, Role } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  // 所有登入用戶都可以存取
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  // 只有 ADMIN 可以存取
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }
}
```

### 公開端點

使用 `@Public()` 裝飾器跳過 JWT 驗證：

```typescript
import { Public } from '../common/decorators/public.decorator';

@Public()
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

## 資料庫管理

### 修改資料庫結構

1. 編輯 `prisma/schema.prisma`

2. 執行 migration：

```bash
docker compose -f docker-compose.dev.yml exec app bun run prisma:migrate
```

**或者直接在指令中指定 migration 名稱**：

```bash
# 指定 migration 名稱
docker compose -f docker-compose.dev.yml exec app bunx prisma migrate dev --name add_user_avatar

# 建立 migration 但不執行
docker compose -f docker-compose.dev.yml exec app bunx prisma migrate dev --name add_order_table --create-only
```

3. 重啟服務：

```bash
docker compose -f docker-compose.dev.yml restart app
```

## Docker 指令

### 開發環境

```bash
# 啟動所有服務
bun run docker:dev

# 重新建置並啟動
bun run docker:dev:build

# 停止服務
bun run docker:dev:down

# 查看 logs
bun run docker:dev:logs

# 進入容器
docker compose -f docker-compose.dev.yml exec app sh
```

### 生產環境

```bash
# 部署到生產環境
./deploy.sh

# 或手動執行
docker compose -f docker-compose.yml up -d --build

# 停止服務
docker compose -f docker-compose.yml down

# 查看 logs
docker compose -f docker-compose.yml logs -f app
```

## 開發工作流程

### 新增功能模組

**範例：新增訂單模組**

```bash
# 1. 使用 NestJS CLI 建立模組
docker compose -f docker-compose.dev.yml exec app nest g module orders
docker compose -f docker-compose.dev.yml exec app nest g service orders
docker compose -f docker-compose.dev.yml exec app nest g controller orders

# 2. 編輯 prisma/schema.prisma 新增資料表

# 3. 執行 migration
docker compose -f docker-compose.dev.yml exec app bunx prisma migrate dev --name create_order_table

# 4. 在 app.module.ts 匯入模組
```

### 新增 API 端點

1. 在 Controller 新增方法
2. 使用 Swagger 裝飾器標記：

```typescript
@Get(':id')
@Roles(Role.ADMIN)
@ApiOperation({ summary: '取得特定訂單' })
@ApiResponse({ status: 200, description: '成功', type: OrderResponseDto })
@ApiResponse({ status: 403, description: '無權限' })
@ApiResponse({ status: 404, description: '訂單不存在' })
findOne(@Param('id') id: string) {
  return this.ordersService.findOne(id);
}
```

## 通知系統（可選）

目前程式碼已清理並準備好使用，但預設為註解狀態。

### 啟用通知模組

1. 在 `src/app.module.ts` 取消註解：

```typescript
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // ...
    NotificationsModule, // 取消註解
  ],
})
```

2. 取消 notifications 對應功能註解

3. 設定環境變數：

```bash
# Email 設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

3. 重啟服務

## 安全性

### JWT 密鑰

**重要**：生產環境務必更換 `JWT_SECRET`：

```bash
# 生成隨機密鑰
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 密碼加密

- 使用 bcrypt (10 rounds)
- 資料庫不儲存明文密碼
- 查詢時排除密碼欄位（Prisma `omit`）

## 常見問題

### Q1: 如何重置資料庫？

**開發環境**：

```bash
docker compose -f docker-compose.dev.yml exec app bunx prisma migrate reset
# 會刪除所有資料、重新執行 migrations、執行 seed
```

**生產環境**：不建議重置，請使用 migration 逐步更新

### Q2: 修改 .env 後沒有生效？

容器需要重啟才能讀取新的環境變數：

```bash
docker compose -f docker-compose.dev.yml restart app
```

### Q3: Prisma Client 找不到？

```bash
docker compose -f docker-compose.dev.yml exec app bun run prisma:generate
docker compose -f docker-compose.dev.yml restart app
```

### Q4: 如何新增管理員帳號？

1. 方法一：修改 `.env` 的 `ADMIN_ACCOUNT_*` 和 `ADMIN_PASSWORD_*`
2. 方法二：直接操作資料庫

## 效能考量

### 資料庫查詢優化

### 索引優化

已在 `deletedAt` 欄位建立索引，加速軟刪除查詢：

```prisma
model User {
  // ...
  deletedAt DateTime?
  @@index([deletedAt])
}
```

## 部署建議

### 環境變數清單

生產環境必須設定：

- `NODE_ENV=production`
- `DATABASE_URL`（生產資料庫連線）
- `JWT_SECRET`（強隨機密鑰）
- `ADMIN_ACCOUNT_*` 和 `ADMIN_PASSWORD_*`

## 相關文檔

- [第三方 API Key 申請指南](./docs/API_KEYS_SETUP.md) - Gmail、TapPay、LinePay、Google Maps 等服務申請流程

## 授權

MIT License - 詳見 [LICENSE](./LICENSE) 檔案

您可以自由使用、修改和分發此專案模板。

## 支援

如有問題或建議，請提交 Issue 或 Pull Request 或 聯絡我。
