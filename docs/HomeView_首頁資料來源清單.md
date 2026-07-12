# HomeView 首頁資料來源清單

以下清單對應目前 `src/views/HomeView.vue` 的首頁區塊，整理每個區塊實際依賴的資料來源，方便後續只調整資料，不改 UI 版型。

## 1. Hero Carousel

- 商品資料：無
- 分類資料：`src/data/categories.json`、Vuex `products/rootCategories`
- banner 資料：`src/data/categories.json` 內的 `bannerImage`、`bannerImages`
- 活動資料：無

用途：
- 首屏主視覺
- 目前以大分類 banner 組成輪播來源

## 2. 快速分類

- 商品資料：無
- 分類資料：Vuex `products/rootCategories`
- banner 資料：`src/data/categories.json` 內的 `icon`、`thumbnailImage`、`bannerImage`
- 活動資料：無

用途：
- 首頁快速導流到主要大分類
- 以大分類入口為主，不承接商品列表

## 3. 限時強檔

- 商品資料：`src/data/products.json` / Vuex `products/allProducts`
- 分類資料：`src/data/categories.json`、Vuex `products/allCategories`
- banner 資料：無
- 活動資料：以商品折扣、`tags`、`requiredOpPoints`、`salesCount` 做排序與篩選

用途：
- 顯示活動感較強、具價格優勢或 OP 換購條件的商品
- 優先顯示可成交商品，不做額外視覺設計

## 4. 新品上市

- 商品資料：`src/data/products.json` / Vuex `products/allProducts`
- 分類資料：可選，僅用於後續篩選
- banner 資料：無
- 活動資料：無

用途：
- 顯示最新匯入或最新排序的正式商品
- 目前以商品資料排序為主
- 首頁固定呈現 12 個商品卡；若最新匯入資料有缺漏，使用同排序規則的可上架商品補齊

## 5. 品牌故事 Banner

- 商品資料：無
- 分類資料：`src/data/categories.json`
- banner 資料：本機圖片或分類 banner
- 活動資料：無

用途：
- 品牌敘事區
- 適合放品牌主圖或最穩定的本機 banner

## 6. 旬味排行

- 商品資料：`src/data/products.json` / Vuex `products/allProducts`
- 分類資料：可選
- banner 資料：無
- 活動資料：以 `salesCount` 為主的排行資料

用途：
- 顯示熱銷、回購或高曝光商品
- 目前以銷售量排序為主
- 首頁熱賣商品專區固定呈現 18 個商品卡；桌面版以 6 欄形成 3 列

## 7. 活動專區

- 商品資料：可選，視活動卡片是否要帶商品入口
- 分類資料：`src/data/categories.json`
- banner 資料：本機活動圖、本機分類 banner
- 活動資料：`src/views/EventView.vue` 對應的活動內容與活動入口

用途：
- 主活動 Banner
- 右側或下方活動卡片
- 可承接分類導流與活動導流
- 桌面版主活動 Banner 與活動卡片群使用等寬雙欄呈現

## 8. 會員 Banner

- 商品資料：無
- 分類資料：無
- banner 資料：本機圖片
- 活動資料：會員註冊、登入、折價券、購物金等會員入口

用途：
- 會員導流
- 會員活動與登入入口
- 桌面版兩張會員 Banner 使用等寬雙欄呈現

## 9. 當季鮮採

- 商品資料：`src/data/products.json` / Vuex `products/allProducts`
- 分類資料：`src/data/categories.json`、Vuex `products/descendantCategoryIds`
- banner 資料：`src/data/categories.json` 內的生鮮分類 banner
- 活動資料：無

用途：
- 顯示 `生鮮直送` 分類及其子分類商品
- 適合呈現季節性與產地直送商品

## 10. 點數換購

- 商品資料：`src/data/products.json` / Vuex `products/allProducts`
- 分類資料：可選
- banner 資料：本機圖片
- 活動資料：`OPExchangeView`、`requiredOpPoints`

用途：
- OP 點數換購導流
- 可搭配換購條件商品

## 11. Tags

- 商品資料：可選，通常不直接綁定
- 分類資料：可選
- banner 資料：無

## 商品卡呈現規則

- 首頁所有商品卡的「加入購物車」按鈕需常駐顯示，不使用滑鼠移入後才顯示的 CTA 行為。
- 首頁商品卡使用固定緊湊高度；內容區保留商品名稱兩行、售價、會員價與加入購物車按鈕，避免價格與按鈕之間出現過多空白。
- 活動資料：無

用途：
- 搜尋熱詞入口
- 暫時以人工整理的關鍵字為主

## 現況重點

- 首頁主資料已經可以完全依賴正式商品資料與本機 banner
- 不需要再使用 `mockProducts`
- 不需要引入外部圖片網址
- 之後若要做首頁曝光優化，只需調整：
  - 商品篩選條件
  - banner 對照資料
  - 區塊排序

## 建議下一步

1. 先確認每個區塊是否都已對齊正式資料來源
2. 再決定哪些區塊需要加上更明確的曝光規則
3. 最後才調整首頁區塊順序與密度
