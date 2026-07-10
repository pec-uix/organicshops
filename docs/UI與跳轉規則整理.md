# UI 與跳轉規則整理

這份文件先整理目前 prototype 中容易造成畫面與流程不一致的地方，作為後續 Functional Ticket 與 Design Pass 的共同依據。

本文件只做盤點與規則收斂，不直接要求一次修改所有頁面。

## 1. 全站導覽規則

### 目前觀察

- 上方主選單、Footer、首頁入口與部分頁面內 CTA 已有路由對照，但不同入口的導向語氣仍需要統一。
- 會員中心與結帳頁屬於需登入流程，目前已透過 `requiresAuth` 控制，但登入後回跳與已登入狀態下進入登入 / 註冊頁的處理需要再確認。
- 商品、活動、PDF 內容、檢驗報告與會員中心各自有列表 / 詳情關係，返回目的地應固定，避免使用者在瀏覽時迷路。
- `/events` 目前轉向 `/event/SUMMER2026`，後續若活動專區拆出列表頁，需要重新定義活動入口與活動詳情的關係。

### 待確認規則

| 情境 | 建議規則 | 待處理 |
|---|---|---|
| 未登入進入結帳 | 導向登入頁，登入後回到原本結帳頁 | 已整理為 router guard 與登入頁 redirect |
| 未登入進入會員中心 | 導向登入頁，登入後回到原本會員頁 | 已整理為 router guard |
| 已登入進入登入 / 註冊 | 導向會員中心；若 URL 帶安全的 redirect，優先回 redirect | 已整理為 guest-only guard |
| 商品詳情返回 | 優先回來源列表；無來源時回商品分類，最後回全部商品 | 已整理商品卡與商品詳情來源 |
| 訂單詳情返回 | 回到我的訂單列表 | 需檢查頁面 CTA |
| 檢驗報告詳情返回 | 回到檢驗報告列表 | 需檢查頁面 CTA |
| PDF 預覽返回 | 回到原本內容列表 | 需檢查健康誌、禮盒型錄 |
| 訂單完成後操作 | 訂單完成頁需由結帳帶入訂單編號；無訂單編號導回購物車 | 已整理為 router guard |

### 對應文件

- `docs/導覽架構_路由對照表.md`
- `docs/導覽校對地圖.md`

## 2. 頁面呈現規則

### 頁面類型

| 頁面類型 | 包含頁面 | 呈現重點 |
|---|---|---|
| 商品型頁面 | 商品列表、商品詳情、搜尋結果、組合商品 | 商品卡、價格語氣、篩選與排序、加入購物車 CTA |
| 交易型頁面 | 購物車、結帳、訂單完成 | 金額層級、折抵資訊、主要操作、手機版摘要 |
| 會員型頁面 | 會員首頁、訂單、地址、折價券、購物金、收藏、通知 | summary card、表單密度、空狀態、手機版會員選單 |
| 內容型頁面 | 最新消息、食譜、健康誌、禮盒型錄、檢驗報告 | 列表卡片、分類 / 篩選、詳情返回、PDF 預覽 |
| 靜態說明頁 | 關於我們、FAQ、購物說明、聯絡客服、門市、隱私權、會員條款 | 標題區、段落密度、資訊分組、行動版閱讀性 |

### 共通呈現原則

- 頁面標題區應使用一致的標題、描述與主要操作層級。
- 列表頁應明確區分篩選區、內容列表、空狀態與分頁 / 更多載入。
- 詳情頁應提供穩定的返回或下一步操作，不只依賴瀏覽器上一頁。
- 交易型頁面應優先讓金額、商品、配送 / 付款與主要 CTA 清楚可掃讀。
- 會員型頁面應避免每頁重新設計卡片與空狀態，優先沿用會員中心既有 pattern。
- 內容型頁面應維持網站內容語氣，不在畫面上顯示工程限制或資料來源提醒。
- 商品列表若有大 / 中 / 小分類入口，應固定顯示麵包屑與同層或下層分類導聯，避免只靠篩選面板承接導覽。
- 商品分類頁建議使用三層路由層級承接大 / 中 / 小分類，query 只作為兼容或輔助，不作為主要頁面層級來源。

### 手機版規則

- 主要操作按鈕應固定在使用者容易找到的位置，但避免遮住金額與表單內容。
- 會員中心側邊選單需轉為適合手機使用的導覽方式。
- 商品列表與內容列表的卡片密度應保持可掃讀，不應因文字過長造成高度跳動過大。
- 結帳與購物車摘要在手機版應有清楚層級，避免使用者看不到最終應付金額。

### 頁面骨架規則

這一節定義每種頁面的基本版型，後續 Design Pass 先依這裡判斷頁面應該長什麼樣，再進入細節調整。

#### A. 一般內容頁

適用頁面：

- `src/views/AboutView.vue`
- `src/views/FaqView.vue`
- `src/views/ShoppingGuideView.vue`
- `src/views/PrivacyView.vue`
- `src/views/MemberTermsView.vue`
- `src/views/ContactView.vue`
- `src/views/StoresView.vue`

| 項目 | 規則 |
|---|---|
| 標題區 | 使用簡潔頁面標題，可搭配一行副標；不需要大型促銷式 hero。 |
| 副標 | 建議保留，說明此頁用途，例如購物流程、品牌理念、條款類型。 |
| 篩選區 | 通常不需要；FAQ 或門市可使用分類 tab / select。 |
| 卡片密度 | 以段落分組或資訊卡為主，避免多層卡片包卡片。 |
| 空狀態 | 通常不會有空狀態；若門市或 FAQ 查無資料，使用 `UiEmptyState` 語氣。 |
| 手機版排序 | 標題、重點資訊、分類 / 搜尋、內容段落；客服或門市 CTA 放在內容後或底部。 |
| Vuetify 對應 | `v-container`、`v-card`、`v-expansion-panels`、`v-tabs`、`v-text-field`。 |

骨架建議：

1. Page title block
2. Optional category / search controls
3. Content sections
4. Related CTA or contact block

補充：

- `購物說明` 頁建議固定拆成「購物流程與結帳步驟、運費與配送規則、注意事項」三段，避免內容重複又保留必要資訊密度。

#### B. 商品型頁面

適用頁面：

- `src/views/ProductListView.vue`
- `src/views/SearchView.vue`
- `src/views/ProductDetailView.vue`
- `src/views/ComboProductView.vue`

| 項目 | 規則 |
|---|---|
| 標題區 | 列表頁顯示分類 / 搜尋標題與商品數；詳情頁使用麵包屑 + 商品名。 |
| 副標 | 列表頁可放分類說明；詳情頁副標以商品規格、產地、溫層補充為主。 |
| 篩選區 | 商品列表與搜尋頁需要篩選、排序、分類入口；詳情頁不放篩選。 |
| 卡片密度 | 商品列表桌機使用 grid，手機使用 2 欄或單欄依資訊密度決定；列表模式保留商品描述。 |
| 空狀態 | 查無商品時提供回全部商品、清除篩選或重新搜尋。 |
| 手機版排序 | 列表：標題、分類 / 搜尋、篩選摘要、商品卡；詳情：圖片、價格、CTA、商品資訊 tab。 |
| Vuetify 對應 | `v-container`、`v-row`、`v-col`、`v-card`、`v-chip`、`v-select`、`v-btn`。 |

骨架建議：

1. Breadcrumb or page title
2. Filter / sort controls for list pages
3. Product grid or product hero
4. Price and primary action
5. Secondary product information
6. Related products

#### C. 交易型頁面

適用頁面：

- `src/views/CartView.vue`
- `src/components/cart/CartDrawer.vue`
- `src/views/CheckoutView.vue`
- `src/views/OrderCompleteView.vue`

| 項目 | 規則 |
|---|---|
| 標題區 | 明確標示目前流程：購物車、填寫資料、確認付款、訂單完成。 |
| 副標 | 只放使用者決策需要的補充，例如配送溫層、應付金額、訂單狀態。 |
| 篩選區 | 不需要篩選；購物車可用溫層分組或配送群組切換。 |
| 卡片密度 | 商品明細、配送 / 付款、折抵、總計應分區；同一層不要卡片套卡片。 |
| 空狀態 | 空購物車應提供繼續購物 CTA；結帳無商品應回購物車。 |
| 手機版排序 | 商品 / 表單在前，金額摘要與主 CTA 要容易找到；必要時使用底部 action bar。 |
| Vuetify 對應 | `v-stepper` 或自訂步驟、`v-card`、`v-radio-group`、`v-select`、`v-checkbox`、`v-btn`、`v-sheet`。 |

骨架建議：

1. Flow title and progress
2. Main content form or item list
3. Summary / price detail
4. Primary action
5. Secondary support links

交易型頁面配送運費門檻提示規則：

- 購物車頁可在目前溫層的免運進度條下方、折價券 / 折扣碼區塊上方，放置低干擾的配送運費門檻提示。
- 提示只作為前往結帳前的輔助確認，不應取代實際運費計算，也不應改動結帳頁金額邏輯。
- 視覺以透明去背、細左線、`text-xs`、低彩度文字為主，避免厚重卡片、大面積色塊或工程提醒語氣。

| 溫層 | 配送方式 | 顯示文案 |
|---|---|---|
| 常溫 | 宅配 | 單筆訂單金額未滿 1200 元，需加收 120 元運費。 |
| 常溫 | 超取 | 單筆訂單金額未滿 599 元，需加收 60 元運費。 |
| 冷凍 | 宅配 | 單筆訂單金額未滿 800 元，需加收 120 元運費。 |
| 冷凍 | 超取 | 單筆訂單金額未滿 800 元，需加收 100 元運費。 |

目前冷藏與產地直送若尚未確認正式門檻，先不顯示本提示區，避免前台出現未確認資訊。

#### D. 會員型頁面

適用頁面：

- `src/views/account/AccountView.vue`
- `src/views/account/ProfileView.vue`
- `src/views/account/OrderListView.vue`
- `src/views/account/OrderDetailView.vue`
- `src/views/account/AddressView.vue`
- `src/views/account/CouponView.vue`
- `src/views/account/WalletView.vue`
- `src/views/account/WishlistView.vue`
- `src/views/account/NotificationCenterView.vue`

| 項目 | 規則 |
|---|---|
| 標題區 | 使用 `AccountContentHeader` 統一標題、副標、返回與主要操作。 |
| 副標 | 建議保留，用一句話說明此頁管理內容。 |
| 篩選區 | 訂單、折價券、購物金、通知可用 tabs / chips；個人資料與地址不需要複雜篩選。 |
| 卡片密度 | 會員首頁與錢包用 summary cards；資料頁用表單卡；列表頁用狀態卡或資料列。 |
| 空狀態 | 我的訂單、折價券、收藏、通知、地址都應有正式網站語氣與下一步 CTA。 |
| 手機版排序 | 會員導覽先轉為可掃讀的手機選單；標題、摘要、主要內容、次要操作依序堆疊。 |
| Vuetify 對應 | `v-tabs`、`v-card`、`v-list`、`v-data-table`、`v-dialog`、`v-form`、`v-btn`。 |

骨架建議：

1. Account navigation
2. Account page header
3. Optional summary cards
4. Tabs / filters if needed
5. Main list, form, or detail
6. Empty state or modal actions

#### E. PDF 內容型頁面

適用頁面：

- `src/views/HealthJournalView.vue`
- `src/views/GiftCatalogView.vue`
- `src/views/InspectionListView.vue`
- `src/views/InspectionDetailView.vue`
- `src/components/content/PdfCard.vue`
- `src/components/content/PdfViewer.vue`

| 項目 | 規則 |
|---|---|
| 標題區 | 健康誌與禮盒型錄可使用內容型 hero；檢驗報告以查找與信任資訊為主。 |
| 副標 | 建議保留，說明內容用途、期數、檢驗品項或閱讀方式。 |
| 篩選區 | 檢驗報告需要品類 / 關鍵字 / 日期篩選；健康誌與禮盒型錄可先不做複雜篩選。 |
| 卡片密度 | PDF 列表使用 `PdfCard`，桌機 2-3 欄；檢驗報告可使用表格感較強的列表卡。 |
| 空狀態 | 使用內容語氣，例如「目前沒有符合條件的報告」，並提供清除篩選或返回列表。 |
| 手機版排序 | 標題、重點數量 / 說明、篩選、PDF 卡片；PDF 預覽應可關閉並回到列表。 |
| Vuetify 對應 | `v-card`、`v-img`、`v-chip`、`v-dialog`、`v-text-field`、`v-select`、`v-data-table`。 |

骨架建議：

1. Content title or hero
2. Optional stats / intro block
3. Filters for inspection report
4. PDF cards or report list
5. PDF preview / detail
6. Empty state

## 3. 共用元件規則

### 優先收斂元件

| 元件 | 目前角色 | 收斂方向 |
|---|---|---|
| `AppHeader.vue` | 全站主導覽 | 對齊主選單、會員 / 購物車入口與搜尋入口 |
| `MobileNavDrawer.vue` | 手機版導覽 | 對齊桌機主選單與會員入口規則 |
| `AppFooter.vue` | Footer 導覽與企業資訊 | 對齊路由對照表，避免重複或無效入口 |
| `ProductCard.vue` | 商品列表卡片 | 對齊商品價格 Design Pass B |
| `PdfCard.vue` | PDF 內容卡片 | 對齊健康誌、禮盒型錄、檢驗報告的內容卡片語氣 |
| `AccountSidebar.vue` | 會員中心導覽 | 對齊會員中心資訊架構與手機版導覽 |
| `AccountContentHeader.vue` | 會員頁標題區 | 統一會員頁標題、副標與操作 |
| `CartDrawer.vue` | 購物車快速檢視 | 對齊購物車頁價格語氣與 CTA 層級 |

### 元件設計規則

- 優先使用既有品牌 token：`brand-primary`、`brand-dark`、`brand-bg`、`brand-surface`、`brand-accent`。
- 卡片、按鈕、標籤、表單與空狀態應先沿用既有樣式，再視需要微調。
- 不新增新的主色系或大型裝飾風格，除非另開 design-token 更新。
- visible UI 不放工程提醒、資料串接說明或內部狀態註記。
- 文件可記錄後續 Vuetify 對應，例如 `v-card`、`v-btn`、`v-chip`、`v-tabs`、`v-dialog`、`v-text-field`。

## 4. 待調整頁面清單

### 第一優先：流程穩定

| 頁面 / 檔案 | 調整重點 | 建議類型 |
|---|---|---|
| `src/router/index.ts` | 登入保護、登入後回跳、已登入進入登入 / 註冊的處理 | Functional Ticket |
| `src/views/LoginView.vue` | 登入後回跳、註冊與忘記密碼入口 | Functional Ticket |
| `src/views/RegisterView.vue` | 註冊後下一步與登入頁互通 | Functional Ticket |

### 第二優先：交易流程

| 頁面 / 檔案 | 調整重點 | 建議類型 |
|---|---|---|
| `src/views/CartView.vue` | 購物車列表、價格明細、主要 CTA | Design Pass |
| `src/components/cart/CartDrawer.vue` | 抽屜內容密度、價格語氣、結帳 CTA | Design Pass |
| `src/views/CheckoutView.vue` | 付款、配送、折抵與應付金額層級 | Design Pass |
| `src/views/OrderCompleteView.vue` | 完成後 CTA 與訂單資訊摘要 | Functional Ticket |

### 第三優先：會員中心

| 頁面 / 檔案 | 調整重點 | 建議類型 |
|---|---|---|
| `src/views/account/AccountView.vue` | 會員首頁 summary 與常用入口 | Design Pass |
| `src/views/account/ProfileView.vue` | 表單欄位與資料狀態 | Design Pass |
| `src/views/account/AddressView.vue` | 地址列表、空狀態、modal | Design Pass |
| `src/views/account/OrderListView.vue` | 訂單列表與狀態標籤 | Design Pass |
| `src/views/account/OrderDetailView.vue` | 訂單詳情資訊層級與返回 | Functional Ticket |
| `src/views/account/CouponView.vue` | 折價券列表與空狀態 | Design Pass |
| `src/views/account/WalletView.vue` | 購物金 / 點數明細與 tab | Design Pass |
| `src/views/account/WishlistView.vue` | 收藏商品空狀態與商品卡一致性 | Design Pass |
| `src/views/account/NotificationCenterView.vue` | 通知列表、已讀狀態、空狀態 | Design Pass |

### 第四優先：商品與內容頁

| 頁面 / 檔案 | 調整重點 | 建議類型 |
|---|---|---|
| `src/views/ProductListView.vue` | 篩選、排序、商品卡列表 | Design Pass |
| `src/views/ProductDetailView.vue` | 價格區、商品資訊、加入購物車 CTA | Design Pass |
| `src/views/ComboProductView.vue` | 組合商品資訊與價格語氣 | Functional Ticket |
| `src/views/SearchView.vue` | 搜尋結果、空狀態、返回商品列表 | Design Pass |
| `src/views/HealthJournalView.vue` | PDF 內容列表與預覽入口 | Functional Ticket |
| `src/views/GiftCatalogView.vue` | 禮盒型錄列表與預覽入口 | Functional Ticket |
| `src/views/InspectionListView.vue` | 檢驗報告列表、篩選、空狀態 | Functional Ticket |
| `src/views/InspectionDetailView.vue` | 檢驗報告詳情、返回列表、PDF 預覽 | Functional Ticket |
| `src/views/NewsListView.vue` | 最新消息列表卡片與分類 | Design Pass |
| `src/views/NewsDetailView.vue` | 詳情頁標題、返回與相關內容 | Design Pass |
| `src/views/RecipeView.vue` | 食譜列表與內容卡片 | Design Pass |

### 第五優先：首頁與靜態頁

| 頁面 / 檔案 | 調整重點 | 建議類型 |
|---|---|---|
| `src/views/HomeView.vue` | 首頁入口、商品 / 內容卡片引用、手機第一屏 | Design Pass |
| `src/views/AboutView.vue` | 品牌內容段落層級 | Design Pass |
| `src/views/FaqView.vue` | 問答分類與閱讀密度 | Design Pass |
| `src/views/ShoppingGuideView.vue` | 購物流程、付款配送、退換貨資訊 | Design Pass |
| `src/views/ContactView.vue` | 聯絡方式與表單呈現 | Design Pass |
| `src/views/StoresView.vue` | 門市列表與資訊卡 | Design Pass |
| `src/views/PrivacyView.vue` | 條款閱讀性 | Design Pass |
| `src/views/MemberTermsView.vue` | 條款閱讀性 | Design Pass |

## 建議執行順序

1. 先確認本文件中的導覽規則與頁面分類是否符合預期。
2. 針對 `src/router/index.ts` 與登入 / 註冊流程開 Functional Ticket。
3. 接著做全站共用元件 Design Pass：Header、Mobile Drawer、Footer。
4. 再做交易流程 Design Pass：購物車、購物車抽屜、結帳、完成訂單。
5. 會員中心、商品頁、PDF 內容型頁面依序收斂。
6. 最後整理首頁與靜態內容頁。
7. 每次修改 `src/` 後執行 `npm run build`。

## Step 2 完成紀錄

本輪只處理跳轉規則，不調整頁面視覺。

已完成：

- `/checkout` 與 `/account/*` 未登入時導向 `/login?redirect=原路徑`。
- 登入頁、第三方登入與註冊流程會使用安全的站內 redirect 回到原本目的地。
- 已登入使用者進入 `/login` 或 `/register` 時，導向會員中心；若帶安全 redirect，優先導向 redirect。
- 補上 `/register-profile` 路由，並保留註冊後補資料再回原流程的跳轉。
- `/order-complete` 需由結帳流程帶入 `orderNumber`，直接進入時導回購物車。
- 商品卡進入商品詳情時帶入來源列表；商品詳情返回優先回來源，無來源時回商品分類或全部商品。
- 組合商品行動版返回按鈕固定導向商品列表，不再依賴瀏覽器上一頁。

## Step 3 完成紀錄

本輪定義頁面骨架規則，不調整實際 UI。

已完成：

- 一般內容頁骨架：標題、副標、內容分組、FAQ / 門市可選分類或搜尋。
- 商品型頁面骨架：列表篩選、商品卡密度、詳情頁圖片 / 價格 / CTA / 商品資訊順序。
- 交易型頁面骨架：流程標題、商品 / 表單、金額摘要、主操作與手機版 action bar。
- 會員型頁面骨架：會員導覽、共用頁首、summary card、tabs / filters、列表與空狀態。
- PDF 內容型頁面骨架：內容 hero、PDF 卡片、檢驗報告篩選、PDF 預覽與空狀態。
- 每一類頁面皆補上未來 Vuetify 對應元件，方便後續正式開發轉換。

## Step 4 完成紀錄

本輪只調整共用元件，不進入單一頁面的版型重排。

已完成：

- `AppHeader.vue`：桌機工具列會依登入狀態切換登入 / 註冊或會員中心 / 我的訂單 / 通知中心，並移除頂部資訊列的裝飾符號。
- `MobileNavDrawer.vue`：會員中心與通知中心快捷入口在未登入時導向登入頁，並保留登入後回到原目的地。
- `AppFooter.vue`：修正 Footer 快捷 icon 的 hover class，避免樣式失效。
- `PdfCard.vue`：PDF 卡片收斂為 `rounded-2xl`、標準邊框與等高卡片結構。
- `AccountSidebar.vue`：桌機與手機會員導覽補上標準卡片邊框。
- `AccountContentHeader.vue`：會員頁標題區補上標準卡片邊框，操作按鈕手機版也可見。
- `CartDrawer.vue`：推薦商品使用 `ProductCard` 的 editorial / full-width 模式，底部 CTA 文案改為符合實際導向的「查看購物車並結帳」。
- `ProductCard.vue`：沿用 Step 2 已補的來源回傳與現有價格卡片規則，本輪未再擴大調整。

後續建議：

- Step 5 進入交易流程時，再細修購物車頁、結帳頁與完成訂單頁的實際區塊層級。
- 若要繼續 Design Pass，可優先處理 Header / Mobile Drawer 的導覽內容是否完全對齊 `docs/導覽架構_路由對照表.md`。

## Step 5 完成紀錄

本輪先收斂交易流程的可讀性與 CTA 層級，不更動折扣、運費、點數、購物金或購物車計算邏輯。

已完成：

- `CartView.vue`：溫層分開結帳提示改為較輕量的提示樣式，商品列在手機版改為可換行排列，避免數量、金額與刪除按鈕互相擠壓。
- `CartView.vue`：結帳明細提示文案收斂為使用者語氣，溫層 CTA 補強為「此溫層商品將一起結帳」。
- `CartView.vue`：加價購區塊文案調整為符合目前操作的「符合門檻後可一併加入購物車」。
- `CartDrawer.vue`：沿用 Step 4 的 CTA 文案與推薦商品卡片規則，作為購物車頁的快速入口。
- `CheckoutView.vue`：手機版底部操作列固定顯示應付金額與下一步 / 送出訂單按鈕，讓使用者不必滑到底才確認主要操作。
- `CheckoutView.vue`：手機版訂單摘要按鈕直接顯示溫層、商品項數與應付金額，展開 / 收合語氣更清楚。
- `CheckoutView.vue`：若目前結帳溫層沒有商品，直接回購物車，避免空流程。
- `OrderCompleteView.vue`：完成頁主 CTA 改為查看會員訂單，繼續購物改為次要 CTA。
- `OrderCompleteView.vue`：配送方式與付款方式補齊目前結帳流程使用的值，並將總金額文案統一為「實際付款金額」。

後續建議：

- 下一輪若繼續交易流程，可做更細的視覺 Design Pass：結帳頁表單密度、折抵卡片層級、訂單完成頁的配送進度是否保留。
- 交易流程完成後，再進入 Step 6 會員中心收斂。

## Step 6 完成紀錄

本輪收斂會員中心頁面風格，不調整會員制度、訂單資料、折價券規則、購物金計算或收藏資料邏輯。

已完成：

- `AccountView.vue`：會員服務入口卡片補齊標準邊框與 hover 層級。
- `ProfileView.vue`：移除前台內部說明語氣，基本資料、聯絡偏好、修改密碼、社群綁定卡片補上標準邊框。
- `AddressView.vue`：地址卡、空狀態與地址 modal 圓角收斂，空狀態改為標準 dashed card。
- `OrderListView.vue`：訂單狀態 tabs、日期 / 訂單狀況 / 訂單編號查詢、交易紀錄式訂單卡與空狀態收斂，空狀態補上前往商品列表 CTA。
- `OrderDetailView.vue`：訂單狀態、商品明細、配送 / 付款 / 費用卡片補齊標準邊框；找不到訂單時不再 fallback 到其他訂單，改顯示返回訂單列表。
- `CouponView.vue`：折價券 tabs、券卡、注意事項與空狀態收斂；主要文字、tab、券面額度與 CTA 改回 `brand-primary` / `brand-surface` / `brand-dark` token，避免與全站品牌色不一致。
- `WalletView.vue`：購物金總覽、tabs、明細列表、注意事項與空狀態收斂；發放標籤、正向金額、tab hover 與空狀態 icon 改回 `brand-primary` / `brand-surface` token，並移除程式註解中的串接提醒。
- `WishlistView.vue`：空狀態收斂為 dashed card，CTA 改用標準 `btn-primary`。
- `NotificationCenterView.vue`：summary card 補上標準邊框，分類空狀態補上陰影層級。

後續建議：

- 若要再做會員中心 Design Pass B，可專注在 icon 系統與手機版導覽的視覺細節。
- 下一步可進入 Step 7：商品與內容頁收斂。

## Step 7 完成紀錄

本輪整理商品與內容頁的一致性，只調整列表、詳情、PDF 卡片、篩選區與空狀態呈現，不更動商品資料、價格、折扣、購物車或 PDF 內容邏輯。

已完成：

- `ProductListView.vue`：`/products` 固定回商品列表入口，禮盒型錄維持由 `/gift-catalog` 負責，避免商品入口與 PDF 內容入口混在一起。
- `ProductListView.vue`：商品查無結果空狀態收斂為標準 dashed card，並保留推薦商品區。
- `ProductListView.vue`：進階篩選從頁內展開改為右側 drawer 呈現，沿用購物車側邊抽屜的遮罩、滑入動畫、固定 header / footer 與可捲動內容區。
- `ProductCard.vue`：商品列表卡移除規格數與促銷摘要列，固定商品名稱、價格與 CTA 區塊高度，讓 grid 卡片底部按鈕更一致。
- `ProductDetailView.vue`：找不到商品、促銷訊息、配送資訊、加入購物車提示與 lightbox 圓角收斂，減少表情符號作為功能 icon。
- `ComboProductView.vue`：組合商品圖片區、品項清單、資訊 tab、價格側欄與保證區統一為標準卡片邊框與圓角。
- `NewsListView.vue`：最新消息主卡、最新更新、列表卡與分類空狀態改為一致的內容卡片規則。
- `NewsDetailView.vue`：消息詳情卡與查無消息狀態收斂為標準內容詳情樣式。
- `RecipeView.vue`：食譜準備中頁面改為內容型頁面語氣與標準卡片圓角。
- `HealthJournalView.vue`：健康誌 hero 移除裝飾光暈，改為穩定內容標題區；空狀態與統計卡片收斂。
- `GiftCatalogView.vue`：禮盒型錄 hero、統計卡片與空狀態收斂，與健康誌維持同一套 PDF 內容型頁面骨架。
- `InspectionListView.vue`：檢驗報告頁首改為與最新消息一致的圖片 banner 與麵包屑，篩選卡、輸入欄位、列表容器與空狀態統一；文字階層收斂為 `type-page-title`、`type-body`、`type-eyebrow` 與 `type-section-title`。
- `InspectionListView.vue`：商品分類改回下拉選單，選項名稱參考正式站檢驗報告分類語氣，但維持目前原型的列表骨架。
- `InspectionListView.vue`：整體視覺改為較明亮的品牌綠層次，頁首加入漸層與色塊，篩選卡與結果列加入更清楚的狀態色與 hover 層次。
- `InspectionListView.vue`：表格區底色、表頭與結果 badge 改為更接近品牌綠的淺層次，減少大面積白底感。
- `InspectionDetailView.vue`：檢驗報告詳情卡、摘要資訊卡與查無報告狀態統一。

後續建議：

- 下一輪可進入首頁與靜態內容頁 Design Pass，檢查首頁入口是否與 Step 7 的商品 / PDF / 內容頁規則一致。
- 若要再細修商品詳情，可另開 Design Pass B 聚焦圖片素材、商品規格 tab 與手機版 CTA 密度。

## Step 8 完成紀錄

本輪最後整理首頁，目標是讓首頁引用前面已穩定的商品、內容、活動與會員入口 pattern，不重新設計新的頁面規則。

已完成：

- `HomeView.vue`：確認首頁主要入口包含商品分類、商品列表、組合商品、產地直送、OPENPOINT 換購、會員註冊、會員優惠、活動、內容中心、最新消息、健康誌、禮盒型錄、檢驗報告與熱門標籤搜尋。
- `HomeView.vue`：新增「安心內容」區塊，集中放置活動卡、內容中心、健康誌、禮盒型錄、檢驗報告與最新消息入口。
- `HomeView.vue`：活動入口固定導向 `/event/SUMMER2026`，內容入口導向 `/content-center`、`/health-journal`、`/gift-catalog`、`/inspections` 與 `/news/:id`。
- `HomeView.vue`：LINE / 會員優惠入口在未登入時導向 `/login?redirect=/account/coupons`，登入後可回到會員優惠頁。
- `HomeView.vue`：熱門標籤保留商品搜尋用途，移除容易混到內容頁的標籤，並修正「銀髮友善」文案。
- `HomeBanner.vue`：首頁 banner 收斂為 `rounded-2xl`、標準陰影與較穩定的手機版高度，減少首頁第一屏壓迫感。
- `HomeBanner.vue`：banner CTA 改為標準圓角按鈕，與其他首頁卡片的操作層級一致。

後續建議：

- 若要繼續下一輪，可進入靜態內容頁 Design Pass，處理關於我們、FAQ、購物說明、客服、門市與條款頁的閱讀密度。
- 首頁若要再細修，可另開 Design Pass B 聚焦 banner 圖片素材與各區塊排序，而不是再新增入口。

## Step 9 執行規則

每完成一輪，只要有修改 `src/`，就執行：

```bash
npm run build
```

如果該輪只整理文件，例如新增或更新 `docs/`，可以不用跑 build。

### 實際執行順序

1. 新增 `docs/UI與跳轉規則整理.md`
2. 整理 `src/router/index.ts` 跳轉規則
3. 統一 `AppHeader.vue`、`MobileNavDrawer.vue`、`AppFooter.vue`
4. 收斂購物車與結帳
5. 收斂會員中心
6. 收斂商品頁
7. 收斂 PDF / 內容型頁面
8. 最後整理首頁
9. 補 Vuetify 對應文件

### 節奏原則

- Functional Ticket 與 Design Pass 交替進行。
- Functional Ticket 先確認欄位、路由、狀態、CTA 與驗收條件。
- Design Pass 再整理顏色、字級、卡片、按鈕、表單密度、空狀態與手機版行為。
- 不同階段不要混改折扣計算、結帳邏輯、會員規則與 UI 呈現，除非 ticket 明確要求。

### 下一個文件任務

下一輪可新增或整理 Vuetify 對應文件，建議放在：

```text
docs/Vuetify對應規則.md
```

文件內容可依目前 prototype pattern 對應 `v-container`、`v-row`、`v-col`、`v-card`、`v-btn`、`v-chip`、`v-tabs`、`v-dialog`、`v-text-field`、`v-select`、`v-checkbox`、`v-data-table`。

## 分類層級調整紀錄

因正式資訊架構可能需要第三或第四層分類，本輪將分類從扁平清單調整為可支援任意層級的 parent tree。

已完成：

- `Category` 型別新增 `slug`、`parentId`、`description`、`sortOrder`、`isVisible`，保留原本 `id`、`name`、`icon`。
- `mockCategories` 改為多層分類資料，商品 `categoryId` 改綁較末層分類。
- 導覽列可點的大分類必須存在於 `mockCategories` root categories；目前已補齊「生活日用」與其下層分類。
- `products` store 新增 `rootCategories`、`childrenByCategoryId`、`categoryAncestors`、`descendantCategoryIds`。
- 商品列表使用父分類時，會包含所有子分類商品。
- 全部商品頁維持無分類條件的總覽列表，不歸入大 / 中 / 小分類層級。
- `ProductListView.vue` 已拆成大分類頁 / 中分類頁 / 小分類頁三種版型，並依層級呈現大 Banner、熱門大分類、中分類入口圖卡、Tabs、精準篩選 chips 與商品網格。
- 大分類頁保留商品篩選面板，可在大分類商品範圍內再篩選中分類、價格、溫層與商品條件。
- `ProductListView.vue` 顯示完整分類 breadcrumb，並在目前分類下方顯示下一層子分類 chips。
- `ProductDetailView.vue` 的 breadcrumb 改為顯示完整分類路徑。
- `AppHeader.vue` 與 `HomeView.vue` 的第一層分類入口只顯示 root categories。
- `MobileNavDrawer.vue` 改為 root categories + 動態下一層展開。

目前策略：

- 路由已改為 `/category/:root/:middle?/:leaf?`，以固定層級承接大 / 中 / 小分類。
- query 只保留搜尋與輔助條件，不再作為主要頁面層級來源。
- 大分類頁偏探索與品牌情境，中分類頁偏縮小範圍，小分類頁偏比價與快速操作。
