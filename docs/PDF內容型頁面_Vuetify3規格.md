# PDF 內容型頁面 Vuetify 3 規格

## 目的

這份文件整理第一階段 PDF 內容型功能的正式規格，對應健康誌、禮盒型錄與檢驗報告三條流程。

目標是把現有 prototype 的內容入口、卡片列表、搜尋篩選與 PDF 預覽，轉成正式專案可直接開發的 Vuetify 3 規格。

## 範圍

### 本階段處理

- 健康誌入口 / PDF 列表
- 禮盒型錄入口 / PDF 列表
- 檢驗報告列表 / 搜尋 / 篩選 / 詳情
- 共用 PDF 卡片與 PDF 預覽元件

### 本階段不處理

- 會員制度
- 優惠折抵
- 結帳流程
- 商品價格邏輯
- 金流與 0 元訂單
- CMS 上傳流程

## 路由規格

| 路由 | 頁面名稱 | 用途 |
|---|---|---|
| `/health-journal` | 健康誌列表 | 期數列表、PDF 閱讀、下載 |
| `/gift-catalog` | 禮盒型錄列表 | 型錄入口、PDF 閱讀、下載 |
| `/inspections` | 檢驗報告列表 | 搜尋、篩選、報告清單 |
| `/inspections/:id` | 檢驗報告詳情 | 單筆報告內容與 PDF 預覽 |

## 資料結構

### 1. 健康誌

| 欄位 | 說明 |
|---|---|
| `id` | 唯一識別碼 |
| `title` | 標題 |
| `subtitle` | 副標題 |
| `description` | 摘要說明 |
| `coverImage` | 封面圖 |
| `pdfUrl` | PDF 連結 |
| `publishDate` | 發佈日期 |
| `issueLabel` | 期數標籤 |
| `isActive` | 是否顯示 |

### 2. 禮盒型錄

| 欄位 | 說明 |
|---|---|
| `id` | 唯一識別碼 |
| `title` | 標題 |
| `description` | 摘要說明 |
| `coverImage` | 封面圖 |
| `pdfUrl` | PDF 連結 |
| `publishDate` | 發佈日期 |
| `seasonLabel` | 檔期標籤 |
| `isActive` | 是否顯示 |

### 3. 檢驗報告

| 欄位 | 說明 |
|---|---|
| `id` | 報告 ID |
| `productId` | 商品 ID |
| `productName` | 商品名稱 |
| `category` | 商品分類 |
| `reportTitle` | 報告標題 |
| `reportDate` | 檢驗日期 |
| `labName` | 檢驗單位 |
| `batchNo` | 批號 |
| `resultLabel` | 結果文字 |
| `pdfUrl` | PDF 連結 |
| `tags` | 檢驗標籤 |
| `isActive` | 是否顯示 |

## 共用元件規格

### 1. `UiPdfCard`

用途：

- 健康誌與禮盒型錄共用的 PDF 入口卡

建議包含：

- 封面圖
- 發佈日期
- 標題
- 摘要
- 期數或檔期標籤
- `線上閱讀`
- `下載 PDF`

對應 Vuetify 3：

- `v-card`
- `v-img`
- `v-chip`
- `v-btn`

### 2. `UiPdfViewer`

用途：

- 檢驗報告詳情頁的 PDF 預覽與操作區

建議包含：

- 標題
- 說明
- 預覽框
- PDF 狀態
- `線上閱讀`
- `下載 PDF`

對應 Vuetify 3：

- `v-card`
- `v-alert`
- `v-btn`
- `v-sheet`

### 3. `UiEmptyState`

用途：

- 無資料、找不到報告、內容整理中

對應 Vuetify 3：

- `v-card`
- `v-icon`
- `v-btn`

## 頁面規格

### 1. 健康誌列表

畫面組成：

- 頁首標題區
- 可閱讀期數摘要
- PDF 卡片列表
- 空狀態

驗收條件：

- 可看到健康誌列表
- 每筆資料都有封面、標題、摘要、日期
- 可開啟 PDF
- 可下載 PDF

### 2. 禮盒型錄列表

畫面組成：

- 頁首標題區
- 可閱讀型錄摘要
- PDF 卡片列表
- 空狀態

驗收條件：

- 可看到禮盒型錄列表
- 可依檔期或年份理解型錄內容
- 可開啟 PDF
- 可下載 PDF

### 3. 檢驗報告列表

畫面組成：

- 搜尋列
- 分類篩選
- 檢驗標籤篩選
- 報告列表
- 無結果狀態

驗收條件：

- 可用關鍵字搜尋
- 可用分類篩選
- 可用標籤篩選
- 查無資料時能正確顯示空狀態

### 4. 檢驗報告詳情

畫面組成：

- 返回列表
- 報告摘要卡
- PDF 預覽區
- 開啟 / 下載操作

驗收條件：

- 可根據 route id 找到正確報告
- 可看到商品名稱、日期、單位、批號、結果
- PDF 可開啟或下載
- 找不到資料時顯示錯誤狀態

## API 規格

先以 mock data 對接，正式 API 可對應以下資源：

- `GET /api/health-journals`
- `GET /api/gift-catalogs`
- `GET /api/inspection-reports`
- `GET /api/inspection-reports/:id`

## 建議執行順序

1. 先定資料結構與 mock data
2. 再統一 PDF 卡片與 PDF 預覽元件
3. 接著整理健康誌與禮盒型錄頁
4. 最後處理檢驗報告搜尋、篩選、詳情頁

## 驗收總則

- 三條流程的畫面語氣一致
- 同一種資料使用同一套卡片語氣
- 不把會員、折扣、結帳邏輯混入 PDF 功能
- 不在前台頁面顯示工程提醒
- 文件規格與 Vuetify 3 元件命名一致
