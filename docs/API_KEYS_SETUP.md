# 第三方 API Key 申請指南

本文檔說明專案中使用的第三方服務 API Key 申請流程。

## 目錄

- [Gmail 應用程式密碼](#gmail-應用程式密碼)
- [TapPay](#tappay)
- [LinePay](#linepay)
- [Google Maps Platform](#google-maps-platform)

---

## Gmail 應用程式密碼

用於發送系統通知郵件（如註冊確認、密碼重置等）。

### 申請步驟

1. 登入 GOOGLE 帳戶 > 點選右上角頭像 > 管理你的 GOOGLE 帳戶 > 安全性 > 啟用兩階段驗證
2. 上方搜尋欄搜尋 **應用** > 應用程式密碼 > 設定一組應用程式密碼 即可拿到 **EMAIL_PASS**

### 環境變數設定

將取得的應用程式密碼填入 `.env` 檔案：

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 相關文檔

- [Google 應用程式密碼說明](https://support.google.com/accounts/answer/185833)

---

## TapPay

用於串接 TapPay 金流服務。

### 申請步驟

1. 註冊 TapPay 帳戶：https://www.tappaysdk.com/
2. **Partner Key** - Portal 左手邊的 Information（公司資訊）
3. **Merchant ID** - 商家管理 > 商家設置

### 環境變數設定

```env
TAPPAY_PARTNER_KEY=your-tappay-partner-key
TAPPAY_MERCHANT_ID=your-tappay-merchant-id
```

### 相關文檔

- [TapPay 開發者文檔](https://docs.tappaysdk.com/)

---

## LinePay

用於串接 LINE Pay 支付服務。

### 申請步驟

1. 請登入合作商店中心：https://pay.line.me/portal/tw/auth/login
2. 從左側選單點選 **[管理付款連結 > 管理連結金鑰]**
3. 請在管理連結金鑰頁面點選 **查詢** 鍵。然後，驗證碼將發送到您創建沙盒帳戶（或註冊合作商店）時輸入的電子郵件地址
4. 顯示 **驗證電子郵件** 視窗：在 **驗證碼** 輸入欄位中輸入透過電子郵件收到的驗證碼，點選 **確認**

### 環境變數設定

```env
LINEPAY_CHANNEL_ID=your-linepay-channel-id
LINEPAY_CHANNEL_SECRET=your-linepay-channel-secret
```

### 相關文檔

- [LINE Pay 開發者文檔](https://pay.line.me/tw/developers/techsupport)

---

## Google Maps Platform

用於地圖定位、距離計算、地址解析等功能。

### 申請步驟

1. 建立新專案：https://console.cloud.google.com/
2. **帳單 > 付款方式**，綁定信用卡（有綁過就不用）
3. **API 與服務 > API 程式庫**，啟動以下 API：
   - Places API (New)
   - Directions API
   - Distance Matrix API
   - Geocoding API
4. **API 與服務 > 憑證 > 建立憑證 > API 金鑰**

### 環境變數設定

```env
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 安全性建議

**重要**：請在 Google Cloud Console 設定 API 金鑰限制：

- **應用程式限制**：限制特定 IP 或 HTTP referrer
- **API 限制**：只允許必要的 API（避免被濫用）

### 相關文檔

- [Google Maps Platform 文檔](https://developers.google.com/maps/documentation)

---

## 注意事項

### 測試環境

開發時建議使用：

- **TapPay**：使用 Sandbox 環境
- **LinePay**：使用 Sandbox 環境
- **Google Maps**：設定每日配額限制（避免意外高額費用）

---

## 故障排除

### Gmail 無法發送郵件

- 確認已啟用兩階段驗證
- 確認使用應用程式密碼（而非帳戶密碼）
- 檢查 Gmail 安全性設定是否阻擋「低安全性應用程式」

### TapPay / LinePay 交易失敗

- 確認環境設定正確（sandbox vs production）
- 檢查金鑰是否過期
- 查看服務商後台的錯誤日誌

### Google Maps API 錯誤

- 確認已啟用所有必要的 API
- 確認帳單已設定
- 檢查 API 金鑰限制設定

---

**最後更新**：2025-11-05
