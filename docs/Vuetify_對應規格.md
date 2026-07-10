# Vuetify 3 對應規格

## 適用範圍

這份文件對應目前統一生機 UI prototype 已確認的常用畫面模式，目標是讓正式專案可直接用 Vuetify 3 實作，不再回推 Tailwind class。

以下規格以 Vuetify 3 的常見用法為主。

## 設計原則

- 以 `v-card` 作為主要內容容器。
- 以 `v-btn` 統一按鈕層級，不再在畫面上硬寫多種按鈕風格。
- 以 `v-chip` 處理狀態、標籤、會員價與 OP 換購。
- 以 `v-text-field`、`v-select`、`v-checkbox` 處理表單與折抵輸入。
- 以 `v-dialog` 與 `v-sheet` 處理 modal、底部抽屜、浮層內容。

## 基礎對應表

| Prototype Pattern | Vuetify 元件 | 建議 props / 用法 | 適用情境 |
|---|---|---|---|
| 主要內容卡 | `v-card` | `rounded="xl"`、`elevation="1"` 或 `variant="outlined"` | 會員總覽、結帳摘要、價格明細、PDF 卡片 |
| 一般資訊區 | `v-card` / `v-sheet` | `rounded="lg"`、`variant="outlined"`、`color="surface"` | 表單區、說明區、條列資訊 |
| 主要按鈕 | `v-btn` | `color="primary"`、`variant="elevated"`、必要時 `block` | 儲存、下一步、確認送出、加入購物車 |
| 次要按鈕 | `v-btn` | `variant="outlined"`、`color="primary"` | 返回、查看明細、下載、次要操作 |
| 文字按鈕 | `v-btn` | `variant="text"`、`size="small"`、`color="primary"` | 收合、切換、輕量操作 |
| 狀態標籤 | `v-chip` | `size="small"`、`label`、`color`、`text-color` | 已讀、未讀、配送狀態、折價券狀態 |
| 會員價標籤 | `v-chip` | `size="small"`、`color="primary"`、`text-color="white"` | 商品價格區、購物車、明細 |
| OP 換購標籤 | `v-chip` | `size="small"`、`color="deep-orange"` 或 theme accent | 商品卡、商品詳情、購物車 |
| 表單輸入 | `v-text-field` | `variant="outlined"`、`density="compact"`、`hide-details="auto"` | 姓名、手機、Email、點數、購物金、折扣碼 |
| 下拉選單 | `v-select` | `variant="outlined"`、`density="compact"`、`hide-details="auto"` | 折價券、配送方式、付款方式 |
| 勾選 | `v-checkbox` | `density="compact"`、`hide-details="auto"` | 同訂購人、同意條款、偏好通知 |
| 對話框 | `v-dialog` | `max-width`、`persistent` 視情況使用 | 通知詳情、地址編輯、PDF 預覽、登入提示 |
| 底部抽屜 / 半屏浮層 | `v-sheet` + `v-dialog` | `scrollable`、`tile`、`rounded-t-xl` | Mobile bottom sheet、購物車抽屜、操作面板 |

## Typography 對應建議

目前 prototype 已集中出一組 Tailwind typography utility，正式 Vuetify 專案不需要沿用 class 名稱，但應保留同一套層級邏輯。

| Prototype utility | Vuetify 建議對應 | 用途 |
|---|---|---|
| `type-hero-title` | `text-h3` / theme `h3` | 首頁 hero、內容型 hero |
| `type-page-title` | `text-h4` / theme `h4` | 商品列表、會員頁、一般內容頁標題 |
| `type-section-title` | `text-h5` / `v-card-title` 加強版 | 首頁區塊、頁面內主要區塊 |
| `type-card-title` | `text-subtitle-1 font-weight-bold` | 商品卡、內容卡、會員 summary card |
| `type-nav` | `text-body-2 font-weight-bold` | Header 主選單、導覽項目 |
| `type-action` | `text-body-2 font-weight-bold` | 登入、註冊、tabs、次要操作 |
| `type-body` | `text-body-1` 或 `text-body-2` | 商品描述、活動描述、PDF 描述 |
| `type-muted` | `text-caption` | 日期、摘要、表單 hint、次要資訊 |
| `type-eyebrow` | `text-overline font-weight-black` | 英文小標、分類小標、狀態前綴 |

正式 Vuetify theme 建議：

- `font-family` 使用 `Inter`, `Noto Sans TC`, `sans-serif`。
- Header 主選單與登入 / 註冊使用 `font-weight: 700`，避免 `900`。
- `v-btn` 主要 CTA 可維持 `font-weight: 900`，次要按鈕用 `700`。
- `v-chip` / badge 可維持小字級高字重，但購物車數量 badge 可改成品牌綠小圓點，降低紅色提示的壓迫感。
- `v-card-title` 不要預設過大；卡片標題以 16-18px、`font-weight: 700` 為主。

## 卡片對應建議

### 1. 摘要卡

用途：

- 會員中心總覽
- 購物金摘要
- 折價券摘要
- 結帳摘要

建議用法：

```vue
<v-card rounded="xl" elevation="1" class="pa-4">
  <div class="text-overline">Label</div>
  <div class="text-h5 font-weight-black">Value</div>
  <div class="text-caption text--secondary">Description</div>
</v-card>
```

重點：

- Value 放主要數字或狀態
- Description 放輔助說明
- 若需要多欄，外層用 `v-row` / `v-col`

### 2. 一般內容卡

用途：

- 會員資料
- 付款方式
- 配送資料
- 折抵設定
- 訂單詳情

建議用法：

```vue
<v-card rounded="xl" variant="outlined" class="pa-6">
  <v-card-title class="px-0 pt-0">Title</v-card-title>
  <v-card-text class="px-0 pb-0">Content</v-card-text>
</v-card>
```

重點：

- 若區塊內有多個子區，盡量使用卡內分段，不要再套卡。
- 行動版以直向堆疊為主，桌機再做雙欄或多欄。

### 3. PDF / 內容卡

用途：

- 健康誌
- 禮盒型錄
- 檢驗報告

建議用法：

```vue
<v-card rounded="xl" variant="outlined">
  <v-img :src="coverImage" aspect-ratio="1.4" />
  <v-card-title>Title</v-card-title>
  <v-card-subtitle>Subtitle</v-card-subtitle>
  <v-card-actions>
    <v-btn variant="text" color="primary">線上閱讀</v-btn>
    <v-btn variant="outlined" color="primary">下載 PDF</v-btn>
  </v-card-actions>
</v-card>
```

重點：

- PDF 內容頁以卡片網格為主
- 若有列表與詳情，列表用卡片，詳情用 `v-dialog` 或獨立頁

## 按鈕對應建議

### 主要按鈕

適用：

- 下一步
- 儲存變更
- 確認送出
- 加入購物車

建議：

- `v-btn color="primary" variant="elevated"`
- 重要頁面可加 `block`
- 桌機與手機都維持同一主要色

### 次要按鈕

適用：

- 返回
- 查看明細
- 下載
- 取消

建議：

- `v-btn variant="outlined" color="primary"`
- 不要比主要按鈕更搶眼

### 文字按鈕

適用：

- 收合其他常用地址
- 切換通知分類
- 展開摘要

建議：

- `v-btn variant="text" size="small" color="primary"`
- 只承擔輕量操作，不做主 CTA

## Chip / Badge 對應建議

### 標籤分類

用途：

- 溫層
- 有機認證
- 配送狀態
- 通知狀態
- 折價券狀態

建議：

- `v-chip size="small" label`
- 顏色依用途固定，不要頁面各自發明

### 價格標籤

用途：

- 會員專屬價
- OP 換購
- 省額

建議：

- 會員價用 `color="primary"` 或 theme primary
- OP 換購用 accent / deep orange
- 省額用 accent chip 或文字

### 狀態標籤建議

| 狀態 | Vuetify 建議色 |
|---|---|
| 已讀 / 已完成 | `grey` / `green` |
| 未讀 / 提醒 | `primary` / `orange` |
| 過期 / 錯誤 | `red` |
| 預設 / 主帳號 | `primary` |

## 表單對應建議

### `v-text-field`

適用：

- 姓名
- 手機
- Email
- 購物金
- OP 點數
- 折扣碼

建議：

- `outlined`
- `dense`
- `hide-details="auto"`
- 密集資訊區可加 `clearable`，但不要過度使用

### `v-select`

適用：

- 折價券選擇
- 付款方式
- 配送方式
- 篩選條件

建議：

- `outlined`
- `dense`
- `hide-details="auto"`
- 若是可搜尋清單，可加 `menu-props`

### `v-checkbox`

適用：

- 同訂購人
- 同意條款
- 偏好通知

建議：

- `dense`
- `hide-details="auto"`
- 標籤文字維持短句，不要太長

## Dialog / Sheet 對應建議

### `v-dialog`

適用：

- 通知詳情
- 地址編輯
- PDF 預覽
- 登入提示

建議：

- 桌機內容通常 `max-width` 控制在 `720px` 到 `960px`
- 內容多時加 `scrollable`
- 預設避免太大陰影或過度圓角

### `v-sheet`

適用：

- 底部抽屜內容
- 半屏浮層
- Mobile bottom sheet

建議：

- 搭配 `v-dialog`
- 使用 `rounded-t-xl` 或 `rounded-t-2xl`
- 應保留可滾動內容與固定操作列

## 會員中心常用組合

### 會員總覽

- 外層：`v-card` / `v-sheet`
- 數字：`text-h5` / `text-h6`
- 狀態：`v-chip`
- CTA：`v-btn text`

### 購物金 / 折價券 / 通知中心

- 清單：`v-card` + `v-row` / `v-col`
- 狀態：`v-chip`
- 操作：`v-btn text` 或 `outlined`

### 訂單詳情 / 結帳摘要

- 主摘要：`v-card`
- 小結：`v-card` 內再用 `v-divider`
- 付款金額：`text-h4` 或 `text-h5` 搭配 `font-weight-black`

## 不建議的做法

- 不要每個卡片都用不同圓角半徑。
- 不要把 `v-card` 再包一層浮動卡。
- 不要在主要流程頁使用太重的 `elevation`。
- 不要把按鈕語義混用，主要 / 次要 / 文字按鈕要分清楚。
- 不要用工程提示取代畫面文案。

## 建議交付方式

正式專案可以直接拆成三份：

1. `Vuetify Theme / Token 對應表`
2. `Vuetify 共用元件規格`
3. `頁面級組合規格`

這樣開發時能直接對照，不需要每個頁面臨時決定元件語氣。
