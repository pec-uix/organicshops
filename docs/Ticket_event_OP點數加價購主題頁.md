# Ticket：活動專區新增 OP 點數加價購主題頁

## 目標

在活動專區的「主題企劃」新增 OP 點數加價購入口，讓消費者可查看能以 OP 點數搭配加購價購買的指定商品。

## 調整範圍

| 區塊 | 檔案 | 說明 |
| --- | --- | --- |
| 活動路由 | `src/router/index.ts` | 新增 `/event/op-exchange`，保留既有 `/op-exchange` |
| 主選單 | `src/constants/navigation.ts` | 活動專區主題企劃新增「OP 點數加價購」 |
| 主題頁 | `src/views/OPExchangeView.vue` | 改為活動企劃頁版型，呈現點數狀態、使用步驟與可換購商品 |

## 呈現規則

- 使用既有 `mockProducts` 中含 `requiredOpPoints` 的商品作為 OP 換購商品來源。
- 商品卡沿用 `ProductCard`，顯示 OP 點數與加購金額。
- 未登入時可瀏覽商品，點擊加入會導向登入。
- 登入狀態顯示目前可用點數與點數效期。

## 驗收條件

- 活動專區主題企劃可看到「OP 點數加價購」入口。
- 進入 `/event/op-exchange` 可看到 OP 點數加價購主題頁。
- 頁面商品皆為 OP 點數加價購商品。
- 不調整購物車、結帳或 OPENPOINT 實際扣點邏輯。
