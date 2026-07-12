# Product Import Tool

一次性商品資料匯入工具，用來從舊版統一生機購物網公開頁面擷取商品資料與圖片，輸出給目前 UI prototype 使用。此工具不登入、不繞過驗證，也不讀取會員私人資料。

## 目前專案架構

- 前端：Vue 2、TypeScript、Vuex、Vue Router
- 樣式：Tailwind CSS
- 建置：Vue CLI `vue-cli-service build`
- 匯入工具：Node.js script，使用 Node 內建 `fetch` 與檔案系統 API，不改既有 UI 元件或頁面

## 舊站 HTML 解析摘要

- 首頁 `index.aspx`
  - 分類導覽在 `<nav>` 內。
  - 主分類使用 `li#MainId_{cid}`，子分類使用 `li#SubId_{cid}`。
  - 分類連結格式為 `categories.aspx?cid={cid}`。
- 分類頁 `categories.aspx?cid={cid}`
  - 麵包屑在 `#PagePath`。
  - 商品列表在 `.boxrow`。
  - 單一商品卡為 `.boxitem`，商品連結格式為 `/product.aspx?id={oldProductId}`。
  - 商品卡提供商品名稱、列表售價、會員價與列表圖片。
- 商品頁 `product.aspx?id={oldProductId}`
  - 商品名稱在 `#name`。
  - 商品編號在 `#ContentPlaceHolderContain_model`，也可由 `product:retailer_item_id` meta 取得。
  - 價格可由 `#ContentPlaceHolderContain_origin`、`#ContentPlaceHolderContain_onsale` 與 schema meta 取得。
  - 主圖與縮圖在 `#ContentPlaceHolderContain_smallPhotoPanel`、`og:image` 與 Schema.org JSON-LD。
  - 詳細內容在 `#detailtabs`，其中 `#tabsdt1`、`#tabsdt2` 作為商品介紹，`#tabsdt3` 作為規格。

## 輸出

執行後會產生：

- `src/data/products.json`
- `export/products.csv`
- `export/download-report.json`
- `export/failed-products.json`
- `public/products/{oldProductId}/main.jpg`
- `public/products/{oldProductId}/gallery-01.jpg`
- `public/products/{oldProductId}/gallery-02.jpg`

每筆商品最多下載 1 張主圖與 4 張商品輪播圖。商品介紹或規格內的裝飾圖、說明圖與長圖不會下載，輸出時會移除內文 `<img>` 標籤，避免新版網站引用舊站圖片。

## 安裝

目前不需要額外安裝套件。確認 Node.js 版本支援內建 `fetch`：

```bash
node --version
```

## 測試執行

抓取 10 筆公開商品：

```bash
npm run products:scrape -- --limit=10
```

抓取最多 150 筆公開商品：

```bash
npm run products:scrape -- --limit=150
```

中途停止後續跑：

```bash
npm run products:scrape -- --limit=150 --resume
```

使用預設 10 筆：

```bash
npm run products:scrape
```

只從特定分類開始抓取：

```bash
npm run products:scrape -- --category=235 --limit=10
```

## 重新下載

預設會避免重複下載既有商品與圖片。若要覆蓋並重新下載：

```bash
npm run products:scrape -- --limit=10 --force
```

## 驗證

匯入後檢查：

```bash
npm run build
```

並確認以下項目：

- `src/data/products.json` 每筆商品都有 `oldProductId`、`productNo`、`productName`、價格與本機圖片路徑。
- `export/products.csv` 欄位順序符合匯入需求。
- `export/download-report.json` 有成功、失敗、略過、重複、圖片數量、容量與需人工確認的紀錄。
- `export/failed-products.json` 記錄本次失敗商品；成功時為空陣列。
- `public/products/{oldProductId}/` 下存在主圖與縮圖。

## 注意事項

- 工具內建約 900ms 請求間隔，避免高頻率請求。
- 單一商品失敗會寫入 `download-report.json`，整批會繼續。
- JSON 內圖片路徑使用 `/products/{oldProductId}/...`，不直接引用舊站圖片網址。
- 同一商品、相同圖片網址或相同圖片內容會避免重複下載。
- 工具只從首頁分類、分類頁與頁面中的實際分頁/商品連結探索，不猜測 `product.aspx?id=`。
- 此工具只針對公開頁面，若舊站 HTML 結構調整，需重新確認解析規則。
