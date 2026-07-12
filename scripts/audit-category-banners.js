#!/usr/bin/env node

const BASE_URL = 'https://www.organicshops.cc'

const categoryPages = [
  ['fresh', '生鮮直送', '/categories.aspx?cid=585'],
  ['fresh-fruits', '新鮮水果', '/categories.aspx?cid=611'],
  ['fresh-produce-box', '蛋品/根莖/蔬果套餐', '/categories.aspx?cid=586'],
  ['fresh-cake', '優選蛋糕', '/categories.aspx?cid=698'],
  ['frozen', '冷凍食材', '/categories.aspx?cid=580'],
  ['frozen-bundle', '任選多件組', '/package.aspx?types=1'],
  ['frozen-flash', '冷凍限時快閃', '/categories.aspx?cid=626'],
  ['frozen-meat', '安心肉品', '/categories.aspx?cid=582'],
  ['frozen-seafood', '安心水產', '/categories.aspx?cid=583'],
  ['frozen-ready', '即食調理', '/categories.aspx?cid=584'],
  ['frozen-quick-cook', '快速料理', '/categories.aspx?cid=678'],
  ['frozen-vegetarian', '蔬食', '/categories.aspx?cid=679'],
  ['frozen-breakfast', '營養早餐', '/categories.aspx?cid=680'],
  ['nuts', '堅果/果乾', '/categories.aspx?cid=590'],
  ['nuts-mixed', '堅果', '/categories.aspx?cid=591'],
  ['nuts-dried-fruits', '果乾', '/categories.aspx?cid=592'],
  ['snacks', '樂活零嘴', '/categories.aspx?cid=143'],
  ['grains', '主食雜糧', '/categories.aspx?cid=145'],
  ['grains-rice', '米', '/categories.aspx?cid=221'],
  ['grains-cereal', '雜糧', '/categories.aspx?cid=222'],
  ['grains-noodles', '麵條', '/categories.aspx?cid=475'],
  ['grains-beans', '豆類', '/categories.aspx?cid=594'],
  ['beverage', '即飲/沖泡', '/categories.aspx?cid=154'],
  ['beverage-ready', '即飲', '/categories.aspx?cid=235'],
  ['beverage-brew', '沖泡', '/categories.aspx?cid=236'],
  ['pantry', '廚房料理品', '/categories.aspx?cid=152'],
  ['pantry-oil', '油品', '/categories.aspx?cid=597'],
  ['pantry-seasoning', '調味品', '/categories.aspx?cid=598'],
  ['pantry-dry-goods', '乾貨', '/categories.aspx?cid=599'],
  ['pantry-cookware', '鍋具用品', '/categories.aspx?cid=715'],
  ['supplements', '保健食品', '/categories.aspx?cid=576'],
  ['daily', '生活日用', '/categories.aspx?cid=653'],
  ['daily-personal-care', '個人清潔', '/categories.aspx?cid=654'],
  ['daily-home', '居家用品', '/categories.aspx?cid=655'],
  ['elderly', '銀髮專區', '/categories.aspx?cid=664'],
  ['elderly-breakfast', '方便早餐', '/categories.aspx?cid=666'],
  ['elderly-dinner', '晚餐食材', '/categories.aspx?cid=667'],
  ['elderly-soup', '滋補湯品', '/categories.aspx?cid=669'],
  ['elderly-snacks', '休閒點心', '/categories.aspx?cid=670'],
  ['elderly-drinks', '喝的保養', '/categories.aspx?cid=671'],
  ['elderly-supplements', '保健食品', '/categories.aspx?cid=673'],
]

function absoluteUrl(value, baseUrl) {
  try {
    return new URL(value, baseUrl).toString()
  } catch (_error) {
    return value
  }
}

function cidFromUrl(value) {
  try {
    return new URL(value).searchParams.get('cid') || ''
  } catch (_error) {
    return ''
  }
}

function extractAdvertisingBlock(html) {
  const match = html.match(/<div id=["']Advertising["'][^>]*>([\s\S]*?)(?:<div class=["']product_category|<div class=["']product_list|<section|<footer)/i)
  return match ? match[1] : ''
}

function extractBannerImages(html, pageUrl) {
  const block = extractAdvertisingBlock(html)
  const banners = []
  const pattern = /<a\b[^>]*href=["']([^"']*)["'][^>]*>[\s\S]*?<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi
  let match
  while ((match = pattern.exec(block))) {
    const linkUrl = absoluteUrl(match[1], pageUrl)
    banners.push({
      imageUrl: absoluteUrl(match[2], pageUrl),
      linkUrl,
      targetCid: cidFromUrl(linkUrl),
    })
  }
  return banners
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const rows = []
  for (const [categoryId, categoryName, sourcePath] of categoryPages) {
    const sourceUrl = absoluteUrl(sourcePath, BASE_URL)
    const response = await fetch(sourceUrl, {
      headers: {
        'user-agent': 'organicshops-ui banner audit',
        accept: 'text/html,application/xhtml+xml',
      },
    })
    const html = await response.text()
    const banners = extractBannerImages(html, sourceUrl)
    rows.push({
      categoryId,
      categoryName,
      sourceUrl,
      bannerCount: banners.length,
      banners,
    })
    await sleep(350)
  }
  console.log(JSON.stringify(rows, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
