# Design Pass：商品卡固定寬度規格

## 本次目的

整理全站商品卡列表的版面呈現規則，避免商品卡因欄位數量或容器寬度不同而出現忽寬忽窄的視覺密度。

本次實作先套用於 `/cart` 滿額加價購區塊；其他頁面先記錄一致化建議，後續可依頁面優先順序分批調整。

## 已實作範圍

| 頁面 | 檔案 | 狀態 |
|---|---|---|
| 購物車滿額加價購 | `src/views/CartView.vue` | 已改為固定 `220px` 卡寬，桌機一列最多五張 |
| 商品列表 List View | `src/components/product/ProductCard.vue` | 已調整手機與桌機橫式卡片密度 |

## 固定卡寬原則

- 商品卡列表不使用會撐滿欄寬的 `minmax(0, 1fr)` 或單純 responsive grid 作為主要寬度邏輯。
- 商品卡使用固定寬度，例如 `220px` 或依既有商品卡規格調整為接近寬度。
- 商品不足一列時，卡片維持固定寬度，不撐滿整列。
- 桌機版一列最多五張商品卡。
- 容器寬度不足時，不壓縮卡片內容，可換行或在手機版提供水平瀏覽。
- 商品卡內部的商品圖比例、兩行品名、價格、按鈕與互動邏輯不因列表規格調整而改變。

## List View 補充規格

- 手機版商品圖片固定為 `90px` 正方形，避免圖片與文字欄互相擠壓。
- 橫式卡片的收藏按鈕固定在商品圖片右上方，不佔用商品資訊欄寬度。
- 商品名稱維持兩行高度，超出以省略號截斷，讓不同商品卡高度穩定。
- OP 換購商品只顯示點數與加價金額，不在下方重複顯示會員價。
- 手機版加入按鈕使用純文字「加入購物車」，桌機版維持較寬 CTA，與價格列左右對齊。

## 已檢查的商品卡列表

| 檔案 | 目前狀態 | 建議 |
|---|---|---|
| `src/views/ProductListView.vue` | 主商品列表使用 `grid-cols-2 md:grid-cols-3 xl:grid-cols-5`，`ProductCard` 內層已有 max-width | 可改成共用固定卡寬列表容器，保留列表模式不動 |
| `src/views/ProductListView.vue` | 推薦商品使用 `lg:grid-cols-6` | 建議改為最多五張一列，或明確定義推薦區小卡規格 |
| `src/views/HomeView.vue` | 多個首頁商品區使用 responsive grid | 可統一改成固定卡寬列表，首頁區塊不足五張時不撐寬 |
| `src/views/ProductDetailView.vue` | 推薦商品使用 `grid-cols-2 sm:grid-cols-4` | 建議改成固定卡寬，避免推薦數量少時密度與列表頁不同 |
| `src/views/account/WishlistView.vue` | 收藏商品使用 responsive grid | 可跟商品列表頁共用固定卡寬規格 |
| `src/views/OPExchangeView.vue` | 點數換購商品使用 responsive grid | 可跟商品列表頁共用固定卡寬規格 |
| `src/views/EventView.vue` | 活動商品使用 `grid-cols-2 lg:grid-cols-3` | 若活動頁商品卡應與全站一致，建議改為固定卡寬 |

## 後續建議

- 建議建立一組商品列表容器樣式或共用 wrapper，例如固定寬卡片列表、水平捲動列表、密集型推薦列表三種。
- 全站 `ProductCard` 已有卡片最大寬度設定，後續調整應優先統一外層列表容器，避免改動商品卡內部價格、標籤與按鈕。
- 若要套用全站，建議下一張設計票先處理 `ProductListView.vue` 與 `HomeView.vue`，再處理會員中心收藏、點數換購與商品詳情推薦區。

## Vuetify 對應建議

- 商品列表容器：`v-row` 搭配固定寬 `v-col`，或外層 flex wrap。
- 商品卡：`v-card` 固定寬度。
- 手機水平瀏覽：外層容器設定 `overflow-x-auto`，卡片使用 `flex: 0 0 auto`。
