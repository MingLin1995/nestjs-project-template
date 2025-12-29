# 新專案設定指南

當您複製此模板來建立新專案時，請按照以下步驟修改關鍵設定，以確保專案識別度與環境配置正確。

## 1. 專案識別資料 (Project Identity)

編輯 `package.json` 修改專案基本資訊：

```json
{
  "name": "your-project-name",               // 專案名稱
  "description": "Your project description", // 專案描述
  "author": "Your Name",                     // 作者
  "private": true                           // 設定為 true 可防止專案被誤發佈到 npm
}
```

## 2. API 文檔設定 (Swagger)

編輯 `src/main.ts` 修改 Swagger 文檔的標頭資訊：

```typescript
const config = new DocumentBuilder()
  .setTitle('Your Project API')        // 修改為您的專案名稱
  .setDescription('API Description')   // 修改為您的專案描述
  .setVersion(`v${packageJson.version}`)
  .addBearerAuth()
  .build();
```

## 3. 環境變數設定 (.env)

複製 `.env.example` 為 `.env` 後，請依需求修改以下關鍵變數。

### 核心設定

| 變數名稱 | 範例值 | 說明 |
| :--- | :--- | :--- |
| `APP_NAME` | My Application | 應用程式名稱 (顯示用) |
| `PROJECT_NAME` | my-app | **重要**：Docker 容器名稱前綴，請務必修改以避免與其他專案衝突 |
| `PORT` | 3000 | 容器內部 PORT (通常不需修改) |
| `APP_PORT` | 3000 | **對外 PORT**：如果您在同一台機器跑多個專案，請修改此埠號以免衝突 |

### 資料庫設定 (PostgreSQL)

| 變數名稱 | 範例值 | 說明 |
| :--- | :--- | :--- |
| `POSTGRES_USER` | dev_user | 資料庫使用者名稱 |
| `POSTGRES_PASSWORD` | dev_password | 資料庫密碼 |
| `POSTGRES_DB` | app_dev | 資料庫名稱 |
| `DATABASE_URL` | ... | **必須與上述設定一致**。格式：`postgresql://<USER>:<PASSWORD>@db:5432/<DB_NAME>?schema=public` |

### 安全性設定

| 變數名稱 | 範例值 | 說明 |
| :--- | :--- | :--- |
| `JWT_SECRET` | (亂數) | **生產環境必改**：請使用 `openssl rand -hex 32` 或 `node` 指令生成長字串 |
| `ENABLE_CORS` | false | 是否啟用跨來源資源共用 |
| `CORS_ORIGINS` | http://localhost | 允許的前端網域 |

## 4. 初始化專案

完成上述修改後，請執行以下步驟：

0. **重置資料庫設定(非必要)**： (注意，會重置所有DB資料)
    ```bash
    docker compose -f docker-compose.dev.yml down -v
    ```

1. **啟動服務**：
    ```bash
    bun run dev
    ```

2. **重置 Git**：
    ```bash
    rm -rf .git
    git init
    git add .
    git commit -m "Initial commit"
    ```
