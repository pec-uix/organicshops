# Vuetify 3 共用元件規格

## 目的

這份文件定義正式專案中可重複使用的 Vuetify 3 元件契約，讓頁面實作時不再各自拼湊樣式。

本規格不是程式碼實作，而是元件抽象與用法標準。

## 設計原則

- 元件命名以用途為主，不以頁面命名。
- 同一類資訊區只能有一種標準做法。
- 卡片、標籤、表單、對話框、底部抽屜分層清楚。
- 交易型頁面與內容型頁面可以不同，但同一頁內要一致。
- 不在前台元件中放工程提醒。

## 共用元件總表

| 元件名稱 | 類型 | 用途 | 主要落點 |
|---|---|---|---|
| `UiSurfaceCard` | card | 一般內容容器 | 會員資料、付款方式、配送資料、折抵設定 |
| `UiSummaryCard` | card | 數字 / 狀態摘要 | 會員總覽、購物金、折價券、結帳摘要 |
| `UiActionBar` | bar | 頁面底部操作列 | 下一步、確認送出、下載、返回 |
| `UiStatusChip` | chip | 狀態、標籤 | 已讀、未讀、配送狀態、折價券狀態 |
| `UiPriceChip` | chip | 價格標籤 | 會員價、OP 換購、省額 |
| `UiField` | input wrapper | 表單欄位框架 | text/select/checkbox 的外層標準 |
| `UiDialogFrame` | dialog | 一般彈窗 | 通知詳情、地址編輯、PDF 預覽 |
| `UiBottomSheet` | sheet | 行動版底部抽屜 | 購物車抽屜、快速操作、手機浮層 |
| `UiPdfCard` | card | PDF 入口卡 | 健康誌、禮盒型錄、檢驗報告 |
| `UiEmptyState` | empty | 空狀態 | 購物車空狀態、清單無資料、查無資料 |

## 元件規格

### 1. `UiSurfaceCard`

用途：

- 一般內容容器
- 表單段落
- 說明區
- 分段資訊區

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `title` | string | `''` | 區塊標題 |
| `subtitle` | string | `''` | 標題下補充說明 |
| `rounded` | string | `xl` | 預設圓角 |
| `outlined` | boolean | `true` | 是否顯示邊框 |
| `dense` | boolean | `false` | 是否縮減內距 |
| `divider` | boolean | `false` | 標題與內容是否分隔 |

建議 slots：

- `header`
- `default`
- `footer`

建議樣式：

- `v-card`
- `rounded="xl"`
- `variant="outlined"` 或 `elevation="1"`
- 內距以 `pa-4` / `pa-6` 為主

不建議：

- 同一層再包第二個卡片
- 每個頁面改不同圓角

### 2. `UiSummaryCard`

用途：

- 顯示主要數字與輔助說明
- 適合三欄、四欄摘要牆

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `eyebrow` | string | `''` | 小標或分類字 |
| `value` | string | `''` | 主要數字 / 狀態 |
| `label` | string | `''` | 補充說明 |
| `tone` | string | `neutral` | `neutral` / `brand` / `warning` / `danger` |
| `to` | string | `''` | 可選跳轉連結 |

建議 slots：

- `icon`
- `actions`

建議樣式：

- `v-card`
- `rounded="xl"`
- `outlined`
- `pa-4`
- value 用 `text-h5` 或 `text-h6`

適用：

- 會員中心總覽
- 購物金摘要
- 折價券摘要
- 結帳前摘要

### 3. `UiActionBar`

用途：

- 承載頁面主操作
- 固定於底部或內容結尾

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `primaryText` | string | `''` | 主按鈕文字 |
| `secondaryText` | string | `''` | 次按鈕文字 |
| `loading` | boolean | `false` | 主操作 loading |
| `disabled` | boolean | `false` | 主操作 disabled |
| `sticky` | boolean | `false` | 是否固定 |

建議 slots：

- `left`
- `secondary`
- `primary`

建議用法：

- 主按鈕：`v-btn color="primary" variant="elevated"`
- 次按鈕：`v-btn variant="text" / outlined`
- 行動版主按鈕通常 `block`

### 4. `UiStatusChip`

用途：

- 狀態、分類、通知、配送、折價券

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `label` | string | `''` | chip 文字 |
| `tone` | string | `neutral` | `neutral` / `success` / `warning` / `danger` / `info` |
| `size` | string | `small` | 建議固定 `small` |
| `rounded` | boolean | `true` | 是否膠囊化 |

建議 tone 映射：

| Tone | Vuetify 3 建議色 |
|---|---|
| `neutral` | `grey` |
| `success` | `green` |
| `warning` | `orange` |
| `danger` | `red` |
| `info` | `primary` |

適用：

- 已讀 / 未讀
- 已完成 / 處理中
- 預設地址
- 檢驗結果

### 5. `UiPriceChip`

用途：

- 價格標籤統一

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `kind` | string | `member` | `member` / `op` / `saving` |
| `text` | string | `''` | chip 文案 |
| `size` | string | `small` | 建議固定 `small` |

建議規則：

- `member`：會員專屬價
- `op`：OP 換購
- `saving`：省額提示

不建議：

- 用不同頁面自己各寫一套價格 chip

### 6. `UiField`

用途：

- 封裝 Vuetify 表單欄位的 label / hint / error / spacing

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `label` | string | `''` | 欄位標題 |
| `hint` | string | `''` | 輔助說明 |
| `error` | string | `''` | 錯誤訊息 |
| `required` | boolean | `false` | 必填標記 |
| `dense` | boolean | `false` | 密集樣式 |

建議 slots：

- `default`：放 `v-text-field` / `v-select` / `v-checkbox`

建議元件組合：

- `v-text-field variant="outlined" density="compact" hide-details="auto"`
- `v-select variant="outlined" density="compact" hide-details="auto"`
- `v-checkbox density="compact" hide-details="auto"`

### 7. `UiDialogFrame`

用途：

- 一般彈窗外框

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `maxWidth` | string | `720` | dialog 寬度 |
| `title` | string | `''` | 標題 |
| `closable` | boolean | `true` | 是否顯示關閉 |
| `scrollable` | boolean | `true` | 是否允許內部滾動 |

建議 slot：

- `title`
- `default`
- `actions`

建議用法：

- `v-dialog`
- 內容卡用 `v-card` 包裹
- 動作列固定在底部

### 8. `UiBottomSheet`

用途：

- 行動版底部抽屜
- 半屏操作面板

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `modelValue` | boolean | `false` | 開關 |
| `height` | string | `auto` | 高度 |
| `title` | string | `''` | 標題 |
| `stickyActions` | boolean | `true` | 是否固定操作列 |

建議樣式：

- `v-dialog`
- 內層 `v-sheet`
- `rounded-t-xl`
- `scrollable`

適用：

- 購物車抽屜
- 手機版快速設定
- 選單型操作面板

### 9. `UiPdfCard`

用途：

- 內容型 PDF 入口卡

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `title` | string | `''` | 文件標題 |
| `subtitle` | string | `''` | 副標題 |
| `coverImage` | string | `''` | 封面圖 |
| `badge` | string | `''` | 期數 / 季節 / 分類 |
| `pdfUrl` | string | `''` | PDF 連結 |
| `downloadUrl` | string | `''` | 下載連結 |

建議 actions：

- 線上閱讀
- 下載 PDF

### 10. `UiEmptyState`

用途：

- 無資料狀態
- 空購物車
- 無搜尋結果

建議 props：

| Prop | 型別 | 預設 | 說明 |
|---|---|---|---|
| `title` | string | `''` | 主標題 |
| `description` | string | `''` | 說明文字 |
| `ctaText` | string | `''` | 按鈕文字 |
| `ctaTo` | string | `''` | 連結 |
| `icon` | string | `''` | 圖示或 emoji |

建議樣式：

- `v-card`
- `text-center`
- `pa-8` / `pa-10`

## 頁面組合建議

### 會員中心頁

- `UiSummaryCard`
- `UiSurfaceCard`
- `UiActionBar`
- `UiStatusChip`

### 購物車 / 結帳頁

- `UiSurfaceCard`
- `UiSummaryCard`
- `UiPriceChip`
- `UiField`
- `UiActionBar`

### PDF 內容頁

- `UiPdfCard`
- `UiEmptyState`
- `UiSurfaceCard`

### 通知中心 / 地址 / 購物金 / 折價券

- `UiSurfaceCard`
- `UiStatusChip`
- `UiActionBar`
- `UiEmptyState`

## 實作順序建議

1. 先做 `UiSurfaceCard`、`UiSummaryCard`、`UiActionBar`
2. 再做 `UiStatusChip`、`UiPriceChip`
3. 接著補 `UiField` 與 `UiDialogFrame`
4. 最後才做 `UiBottomSheet`、`UiPdfCard`、`UiEmptyState`

## 驗收準則

- 同類型資訊區使用同一種元件。
- 同類型 CTA 使用同一種按鈕語氣。
- 同一頁內不出現兩種以上不同摘要卡格式。
- 表單、彈窗、底部抽屜在不同頁面能重複使用。
- 文件與規格不混用 Vuetify 2 舊 props。
