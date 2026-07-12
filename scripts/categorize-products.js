#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const productsPath = path.join(rootDir, 'src/data/products.json')
const categoriesPath = path.join(rootDir, 'src/data/categories.json')
const categorizedPath = path.join(rootDir, 'src/data/products-categorized.json')
const exportDir = path.join(rootDir, 'export')
const mappingCsvPath = path.join(exportDir, 'product-category-mapping.csv')
const distributionPath = path.join(exportDir, 'category-distribution-report.json')
const reviewPath = path.join(exportDir, 'category-review-needed.json')

const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))

const categoryById = new Map(categories.map((category) => [category.id, category]))
const activityCategories = [
  { id: 'activity-op-points', name: '點數換購' },
  { id: 'activity-flash', name: '限時優惠快閃區' },
  { id: 'activity-mediterranean', name: '地中海飲食推薦' },
  { id: 'activity-overnight-oats', name: '隔夜燕麥片專區' },
  { id: 'activity-subscription', name: '訂閱月月配' },
  { id: 'activity-promo', name: '特惠專區' },
  { id: 'activity-pick-any', name: '任選多件組' },
  { id: 'activity-member-day', name: '會員日優惠' },
  { id: 'activity-buy-one-get-one', name: '買1送1必買區' },
  { id: 'activity-bundle', name: '多件組優惠' },
  { id: 'activity-surplus', name: '惜福區' },
  { id: 'activity-seasonal', name: '季節活動' },
  { id: 'activity-gift', name: '健康伴手禮' },
]
const activityById = new Map(activityCategories.map((category) => [category.id, category]))
const sourceCategoryMap = new Map([
  ['生鮮直送 / 新鮮水果', 'fresh-fruits'],
  ['生鮮直送 / 蛋品/根莖/蔬果套餐', 'fresh-produce-box'],
  ['生鮮直送 / 優選蛋糕', 'fresh-cake'],
  ['冷凍食材 / 任選多件組', 'frozen-bundle'],
  ['冷凍食材 / 冷凍限時快閃', 'frozen-flash'],
  ['冷凍食材 / 安心肉品', 'frozen-meat'],
  ['冷凍食材 / 安心水產', 'frozen-seafood'],
  ['冷凍食材 / 即食調理', 'frozen-ready'],
  ['冷凍食材 / 快速料理', 'frozen-quick-cook'],
  ['冷凍食材 / 蔬食', 'frozen-vegetarian'],
  ['冷凍食材 / 營養早餐', 'frozen-breakfast'],
  ['堅果/果乾 / 堅果', 'nuts-mixed'],
  ['堅果/果乾 / 果乾', 'nuts-dried-fruits'],
  ['堅果果乾 / 綜合堅果', 'nuts-mixed'],
  ['堅果果乾 / 果乾', 'nuts-dried-fruits'],
  ['堅果果乾 / 堅果點心', 'snacks'],
  ['主食雜糧 / 米', 'grains-rice'],
  ['主食雜糧 / 雜糧', 'grains-cereal'],
  ['主食雜糧 / 麵條', 'grains-noodles'],
  ['主食雜糧 / 豆類', 'grains-beans'],
  ['主食雜糧 / 米麵雜糧', 'grains-cereal'],
  ['即飲/沖泡 / 即飲', 'beverage-ready'],
  ['即飲/沖泡 / 沖泡', 'beverage-brew'],
  ['健康飲品 / 即飲沖泡', 'beverage-ready'],
  ['廚房料理品 / 油品', 'pantry-oil'],
  ['廚房料理品 / 調味品', 'pantry-seasoning'],
  ['廚房料理品 / 乾貨', 'pantry-dry-goods'],
  ['廚房料理品 / 鍋具用品', 'pantry-cookware'],
  ['廚房料理 / 油品調味', 'pantry-seasoning'],
  ['生活日用 / 個人清潔', 'daily-personal-care'],
  ['生活日用 / 居家用品', 'daily-home'],
  ['銀髮專區 / 方便早餐', 'elderly-breakfast'],
  ['銀髮專區 / 晚餐食材', 'elderly-dinner'],
  ['銀髮專區 / 滋補湯品', 'elderly-soup'],
  ['銀髮專區 / 營養粥品', 'elderly-soup'],
  ['銀髮專區 / 休閒點心', 'elderly-snacks'],
  ['銀髮專區 / 喝的保養', 'elderly-drinks'],
  ['銀髮專區 / 保健食品', 'elderly-supplements'],
  ['保健食品 / 保健食品', 'supplements'],
])

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
}

function stripHtml(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword))
}

function uniqueStrings(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

function sourceKey(categoryName = '', subcategoryName = '') {
  const root = String(categoryName || '').trim()
  const child = String(subcategoryName || '').trim() || root
  return `${root} / ${child}`
}

function sourceRefs(product) {
  const refs = Array.isArray(product.sourceCategories) && product.sourceCategories.length
    ? product.sourceCategories
    : [{ categoryName: product.categoryName || '', subcategoryName: product.subcategoryName || '' }]
  return refs
    .map((ref) => ({
      categoryName: String(ref.categoryName || '').trim(),
      subcategoryName: String(ref.subcategoryName || '').trim(),
    }))
    .filter((ref) => ref.categoryName || ref.subcategoryName)
}

function activityIdsForSource(categoryName = '', subcategoryName = '') {
  const text = `${categoryName} ${subcategoryName}`
  const ids = []
  if (text.includes('點數換購')) ids.push('activity-op-points')
  if (text.includes('限時') || text.includes('快閃')) ids.push('activity-flash')
  if (text.includes('地中海')) ids.push('activity-mediterranean')
  if (text.includes('隔夜燕麥')) ids.push('activity-overnight-oats')
  if (text.includes('訂閱')) ids.push('activity-subscription')
  if (text.includes('任選')) ids.push('activity-pick-any', 'activity-promo')
  if (text.includes('會員日')) ids.push('activity-member-day', 'activity-promo')
  if (text.includes('買1送1')) ids.push('activity-buy-one-get-one', 'activity-promo')
  if (text.includes('多件組')) ids.push('activity-bundle', 'activity-promo')
  if (text.includes('惜福')) ids.push('activity-surplus', 'activity-promo')
  if (text.includes('盛夏') || text.includes('中元') || text.includes('春') || text.includes('夏日') || text.includes('本月推薦')) ids.push('activity-seasonal', 'activity-promo')
  if (text.includes('健康伴手禮')) ids.push('activity-gift')
  if (text.includes('特惠專區')) ids.push('activity-promo')
  return uniqueStrings(ids)
}

function activityIdsForProduct(product) {
  return uniqueStrings(sourceRefs(product).flatMap((ref) => activityIdsForSource(ref.categoryName, ref.subcategoryName)))
}

function secondaryCategoryIdsForProduct(product, result) {
  const name = product.productName || ''
  const ids = Array.isArray(result.secondaryCategoryIds) ? [...result.secondaryCategoryIds] : []
  if (result.categoryId === 'frozen' && /(\d+\s*件組|組合|豪華食材組|任選|多件組)/.test(name)) {
    ids.push('frozen-bundle')
  }
  if (result.categoryId === 'snacks' && name.includes('點心')) {
    ids.push('elderly-snacks')
  }
  return uniqueStrings(ids)
}

function categoryTrail(id) {
  const trail = []
  let current = categoryById.get(id)
  while (current) {
    trail.unshift(current)
    current = current.parentId ? categoryById.get(current.parentId) : null
  }
  return trail
}

function assignment(nodeId, confidence, reason, options = {}) {
  const trail = categoryTrail(nodeId)
  const root = trail[0]
  const leaf = trail[trail.length - 1]
  return {
    categoryId: root ? root.id : 'uncategorized',
    categoryName: root ? root.name : '待分類',
    subcategoryId: leaf && leaf.id !== root.id ? leaf.id : '',
    subcategoryName: leaf && leaf.id !== root.id ? leaf.name : '',
    categoryPath: trail.length ? trail.map((category) => category.name) : ['待分類'],
    categoryConfidence: Number(confidence.toFixed(2)),
    categoryReason: reason,
    needsCategoryReview: confidence < 0.7 || Boolean(options.needsReview),
    secondaryCategoryIds: options.secondaryCategoryIds,
  }
}

function uncategorized(reason) {
  return {
    categoryId: 'uncategorized',
    categoryName: '待分類',
    subcategoryId: '',
    subcategoryName: '',
    categoryPath: ['待分類'],
    categoryConfidence: 0.35,
    categoryReason: reason,
    needsCategoryReview: true,
    secondaryCategoryIds: undefined,
  }
}

function classify(product) {
  const refs = sourceRefs(product)
  const firstRef = refs[0] || { categoryName: product.categoryName || '', subcategoryName: product.subcategoryName || '' }
  const sourceCategoryName = firstRef.categoryName || product.categoryName || ''
  const sourceSubcategoryName = firstRef.subcategoryName || product.subcategoryName || ''
  const name = product.productName || ''
  const shippingType = product.shippingType || ''
  const text = stripHtml([
    name,
    product.shortDescription,
    product.productDescription,
    product.specification,
    sourceCategoryName,
    sourceSubcategoryName,
  ].filter(Boolean).join(' '))
  const nameText = stripHtml(name)

  const sourceReason = sourceCategoryName && sourceSubcategoryName
    ? `原始分類為「${sourceCategoryName} / ${sourceSubcategoryName}」，`
    : ''
  const hasFrozenShipping = shippingType.includes('冷凍')

  for (const ref of refs) {
    const mapped = sourceCategoryMap.get(sourceKey(ref.categoryName, ref.subcategoryName))
    if (mapped) {
      return assignment(mapped, 0.98, `舊站公開分類為「${ref.categoryName} / ${ref.subcategoryName || ref.categoryName}」，直接對應新版分類`)
    }
  }

  if (sourceCategoryMap.has(sourceKey(sourceCategoryName, sourceCategoryName))) {
    const mapped = sourceCategoryMap.get(sourceKey(sourceCategoryName, sourceCategoryName))
    return assignment(mapped, 0.9, `舊站公開分類為「${sourceCategoryName}」，對應新版分類`)
  }

  if (includesAny(nameText, ['鮭魚', '鯖魚', '鱸魚', '鯛魚', '扁鱈', '白蝦', '海陸'])) {
    return assignment('frozen-seafood', 0.95, `${sourceReason}商品名稱含水產或海鮮食材關鍵字`)
  }

  if (
    hasFrozenShipping ||
    includesAny(nameText, ['土雞腿', '雞腿', '雞胸', '全雞', '藻晨雞', '豬梅花', '火鍋肉片', '冰烤蕃薯', '冷凍青花菜', '冷凍野生藍莓'])
  ) {
    const confidence = includesAny(nameText, ['冰烤蕃薯', '冷凍青花菜', '冷凍野生藍莓']) ? 0.82 : 0.9
    if (includesAny(nameText, ['青花菜', '藍莓', '蕃薯', '地瓜'])) {
      return assignment('frozen-vegetarian', confidence, `${sourceReason}商品名稱或配送資訊顯示為冷凍蔬果/蔬食`)
    }
    return assignment('frozen-ready', confidence, `${sourceReason}商品名稱或配送資訊顯示為冷凍食材/調理品`)
  }

  if (includesAny(nameText, ['椰子水', '豆漿', '堅果飲', '黑芝麻糙米飲', '燕麥豆漿'])) {
    return assignment('beverage-ready', 0.92, `${sourceReason}商品名稱含即飲或箱裝飲品關鍵字`)
  }

  if (includesAny(nameText, ['枸杞原汁', '明日葉精力湯'])) {
    return assignment('elderly-drinks', 0.9, `${sourceReason}商品名稱屬於喝的營養補給品`, { secondaryCategoryIds: ['beverage-ready'] })
  }

  if (includesAny(nameText, ['益生菌', '乳酸菌', '葡萄糖胺', '梅精球', '枸杞晶凍', '亞麻仁堅果粉'])) {
    return assignment('supplements', 0.88, `${sourceReason}商品名稱含保健食品或營養補給關鍵字`, { secondaryCategoryIds: ['elderly-supplements'] })
  }

  if (includesAny(nameText, ['橄欖油', '葵花籽油', '酪梨油'])) {
    return assignment('pantry-oil', 0.92, `${sourceReason}商品名稱含油品關鍵字`)
  }

  if (includesAny(nameText, ['蘋果醋', '高湯'])) {
    return assignment('pantry-seasoning', 0.92, `${sourceReason}商品名稱含醋或料理調味關鍵字`)
  }

  if (includesAny(nameText, ['糙米', '白米'])) {
    return assignment('grains-rice', 0.9, `${sourceReason}商品名稱含米類關鍵字`)
  }

  if (includesAny(nameText, ['寬麵', '麵條'])) {
    return assignment('grains-noodles', 0.9, `${sourceReason}商品名稱含麵條關鍵字`)
  }

  if (includesAny(nameText, ['綠豆'])) {
    return assignment('grains-beans', 0.9, `${sourceReason}商品名稱含豆類關鍵字`)
  }

  if (includesAny(nameText, ['燕麥', '藜麥', '奇亞籽', '小麥胚芽', '麥片', '脆穀'])) {
    return assignment('grains-cereal', 0.88, `${sourceReason}商品名稱含燕麥或雜糧關鍵字`)
  }

  if (includesAny(nameText, ['葡萄乾', '蔓越莓乾', '藍莓乾', '蜜棗乾', '無花果乾', '芒果乾', '杏桃乾', '甘栗', '紅棗', '枸杞', '果乾禮盒'])) {
    return assignment('nuts-dried-fruits', 0.92, `${sourceReason}商品名稱含果乾、栗子、紅棗或枸杞關鍵字`)
  }

  if (includesAny(nameText, ['夏威夷果', '三珍果', '腰果', '胡桃', '四果', '堅果', '杏仁', '開心果'])) {
    return assignment('nuts-mixed', 0.94, `${sourceReason}商品名稱含堅果品項關鍵字`)
  }

  if (includesAny(nameText, ['點心', '餅', '蘇打餅', '洋芋片', '脆薯', '海苔', '小饅頭', '星米果', '檸檬糖', '黑芝麻粉', '芝麻粉', '豬肉鬆'])) {
    return assignment('snacks', 0.82, `${sourceReason}商品名稱屬於零嘴、餅乾或點心`)
  }

  if (includesAny(nameText, ['蛋', '蔬菜箱', '蔬果', '地瓜', '根莖'])) {
    return assignment('fresh-produce-box', 0.84, `${sourceReason}商品名稱含蛋品、根莖或蔬果箱關鍵字`)
  }

  if (includesAny(text, ['水果', '鮮果', '蘋果', '水蜜桃', '芭樂', '木瓜', '櫻桃'])) {
    return assignment('fresh-fruits', 0.72, `${sourceReason}商品內容提及水果品類`)
  }

  return uncategorized(`${sourceReason}既有分類多為活動分類，商品名稱與內容未命中新版分類規則`)
}

function csvEscape(value) {
  const normalized = value === undefined || value === null ? '' : String(value)
  if (/[",\n\r]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }
  return normalized
}

function countBy(items, keyFn) {
  const counts = {}
  items.forEach((item) => {
    const key = keyFn(item)
    if (!key) return
    counts[key] = (counts[key] || 0) + 1
  })
  return counts
}

function increment(counts, key) {
  if (!key) return
  counts[key] = (counts[key] || 0) + 1
}

function main() {
  fs.mkdirSync(exportDir, { recursive: true })

  const products = readJson(productsPath)
  const seenIds = new Map()
  const seenProductNos = new Map()
  const duplicates = []
  const duplicateProductNos = []

  const categorized = products.map((product) => {
    const refs = sourceRefs(product)
    const firstRef = refs[0] || { categoryName: product.categoryName || '', subcategoryName: product.subcategoryName || '' }
    const sourceCategoryName = firstRef.categoryName || product.categoryName || ''
    const sourceSubcategoryName = firstRef.subcategoryName || product.subcategoryName || ''
    const result = classify(product)
    const activityCategoryIds = activityIdsForProduct(product)
    const activityCategoryNames = activityCategoryIds.map((id) => activityById.get(id)?.name).filter(Boolean)
    const secondaryCategoryIds = secondaryCategoryIdsForProduct(product, result)
    const id = String(product.oldProductId || '')
    if (id) {
      seenIds.set(id, (seenIds.get(id) || 0) + 1)
      if (seenIds.get(id) > 1) duplicates.push(id)
    }
    const productNo = String(product.productNo || '').trim()
    if (productNo) {
      seenProductNos.set(productNo, (seenProductNos.get(productNo) || 0) + 1)
      if (seenProductNos.get(productNo) > 1) duplicateProductNos.push(productNo)
    }

    const nextProduct = {
      ...product,
      sourceCategoryName,
      sourceSubcategoryName,
      categoryId: result.categoryId,
      categoryName: result.categoryName,
      subcategoryId: result.subcategoryId,
      subcategoryName: result.subcategoryName,
      categoryPath: result.categoryPath,
      categoryConfidence: result.categoryConfidence,
      categoryReason: result.categoryReason,
      needsCategoryReview: result.needsCategoryReview,
      activityCategoryIds,
      activityCategoryNames,
    }

    if (secondaryCategoryIds.length) {
      nextProduct.secondaryCategoryIds = secondaryCategoryIds
    }

    return nextProduct
  })

  const csvColumns = [
    'oldProductId',
    'productNo',
    'productName',
    'sourceCategoryName',
    'sourceSubcategoryName',
    'categoryId',
    'categoryName',
    'subcategoryId',
    'subcategoryName',
    'categoryConfidence',
    'categoryReason',
    'needsCategoryReview',
    'activityCategoryIds',
    'activityCategoryNames',
  ]

  const csvRows = [
    csvColumns.join(','),
    ...categorized.map((product) => csvColumns.map((column) => csvEscape(product[column])).join(',')),
  ]

  const rootCounts = countBy(categorized, (product) => product.categoryId)
  const subcategoryCounts = countBy(categorized, (product) => product.subcategoryId)
  const effectiveCategoryCounts = {}
  categorized.forEach((product) => {
    if (product.subcategoryId) {
      categoryTrail(product.subcategoryId).forEach((category) => increment(effectiveCategoryCounts, category.id))
    } else {
      increment(effectiveCategoryCounts, product.categoryId)
    }
    ;(product.secondaryCategoryIds || []).forEach((categoryId) => {
      categoryTrail(categoryId).forEach((category) => increment(effectiveCategoryCounts, category.id))
    })
  })
  const noImageCount = categorized.filter((product) => !product.mainImageUrl).length
  const reviewNeeded = categorized.filter((product) => product.needsCategoryReview)
  const uncategorizedCount = categorized.filter((product) => product.categoryId === 'uncategorized').length
  const categorizedCount = categorized.length - uncategorizedCount
  const leafOrMiddleCategories = categories.filter((category) => category.parentId)

  const emptyCategories = categories
    .filter((category) => !effectiveCategoryCounts[category.id])
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      parentId: category.parentId,
    }))

  const tooFewCategories = leafOrMiddleCategories
    .filter((category) => {
      const count = subcategoryCounts[category.id] || 0
      return count > 0 && count <= 2
    })
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      count: subcategoryCounts[category.id] || 0,
    }))

  const tooManyThreshold = Math.max(45, Math.ceil(categorized.length * 0.35))
  const tooManyCategories = categories
    .map((category) => category.id)
    .filter((categoryId) => (effectiveCategoryCounts[categoryId] || 0) >= tooManyThreshold)
    .map((categoryId) => {
      const category = categoryById.get(categoryId)
      return {
        categoryId,
        categoryName: category ? category.name : categoryId,
        count: effectiveCategoryCounts[categoryId] || 0,
      }
    })

  const activityCategoryProductCounts = {}
  categorized.forEach((product) => {
    ;(product.activityCategoryIds || []).forEach((id) => increment(activityCategoryProductCounts, id))
  })

  const emptyActivityCategories = activityCategories
    .filter((category) => !activityCategoryProductCounts[category.id])
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
    }))

  const distributionReport = {
    generatedAt: new Date().toISOString(),
    productTotal: categorized.length,
    categorizedProductCount: categorizedCount,
    reviewNeededCount: reviewNeeded.length,
    uncategorizedProductCount: uncategorizedCount,
    rootCategoryProductCounts: rootCounts,
    subcategoryProductCounts: subcategoryCounts,
    effectiveCategoryProductCounts: effectiveCategoryCounts,
    activityCategoryProductCounts,
    emptyActivityCategories,
    emptyCategories,
    tooFewCategories,
    tooManyCategories,
    noImageProductCount: noImageCount,
    duplicateProductCount: duplicates.length,
    duplicateOldProductIds: Array.from(new Set(duplicates)),
    duplicateProductNoCount: duplicateProductNos.length,
    duplicateProductNos: Array.from(new Set(duplicateProductNos)),
    rulesSummary: [
      '先保留舊站 categoryName/subcategoryName 至 sourceCategoryName/sourceSubcategoryName',
      '舊站分類多為活動分類時，改以 productName、商品內容與規格關鍵字判斷',
      '活動專區不作為商品主分類，另存 activityCategoryIds/activityCategoryNames',
      '低於 0.7 信心或新版分類缺少精準品類時，標記 needsCategoryReview',
      '未命中規則時放入待分類，不硬塞到無關分類',
    ],
  }

  writeJson(categorizedPath, categorized)
  fs.writeFileSync(mappingCsvPath, `${csvRows.join('\n')}\n`)
  writeJson(distributionPath, distributionReport)
  writeJson(reviewPath, reviewNeeded)

  console.log(JSON.stringify({
    productTotal: distributionReport.productTotal,
    categorizedProductCount: distributionReport.categorizedProductCount,
    reviewNeededCount: distributionReport.reviewNeededCount,
    uncategorizedProductCount: distributionReport.uncategorizedProductCount,
    duplicateProductCount: distributionReport.duplicateProductCount,
    noImageProductCount: distributionReport.noImageProductCount,
    outputFiles: [
      path.relative(rootDir, categorizedPath),
      path.relative(rootDir, mappingCsvPath),
      path.relative(rootDir, distributionPath),
      path.relative(rootDir, reviewPath),
    ],
  }, null, 2))
}

main()
