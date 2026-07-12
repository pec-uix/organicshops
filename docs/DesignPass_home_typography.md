# Design Pass: 首頁字型層級一致化

## 範圍

- 頁面：`/`
- 檔案：`src/views/HomeView.vue`
- 檔案：`src/components/layout/HomeBanner.vue`

## 調整內容

- 首頁區塊標題移除自訂 serif 字型，回到全站 sans 字型脈絡。
- 首頁區塊標題維持 20-24px 的區塊標題層級。
- 首頁英文 eyebrow 與裝飾標籤統一不低於 `text-[10px]`。
- Hero 主標保留 `font-serif font-black`，作為首頁少量品牌感使用。
- Hero 副標改為一般內文層級：`text-sm font-medium leading-7`。
- 首頁商品卡 compact 版型改為固定資訊區高度，品名、售價、會員價與加入購物車按鈕之間保留穩定留白。

## Vuetify Mapping

- Hero 主標：`v-img` overlay 內的 `text-h3` / `text-h2`，可加品牌展示字型 class。
- 區塊標題：`text-h6` / `text-h5` 搭配 `font-weight-black`。
- Eyebrow / badge：`v-chip` 或 `span`，字級對應 10-11px、字重 black。
- 副標與描述：`text-body-2` 或 `text-body-1`，依區塊密度調整。

## Acceptance Criteria

- 首頁不再出現 `text-[9px]` 的可見文字。
- 首頁一般區塊標題不使用 serif 字型。
- Hero 主標仍可使用 serif，但不擴散到商品卡、活動卡與區塊標題。
- 首頁文字層級符合 `docs/網站文字規則.docx` 的大小與字重原則。
- 首頁商品卡的商品名稱最多兩行，價格區與 CTA 不因單行或雙行品名產生壓縮或上下黏連。
