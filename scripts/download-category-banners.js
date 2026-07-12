#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')

const BASE_URL = 'https://www.organicshops.cc'
const ROOT_DIR = path.resolve(__dirname, '..')
const OUTPUT_DIR = path.join(ROOT_DIR, 'public/category-banners')
const REPORT_PATH = path.join(ROOT_DIR, 'export/category-banner-report.json')
const REQUEST_DELAY_MS = 350

const PAGES = [
  { categoryId: 'fresh', sourceUrl: `${BASE_URL}/categories.aspx?cid=585` },
  { categoryId: 'fresh-fruits', sourceUrl: `${BASE_URL}/categories.aspx?cid=611` },
  { categoryId: 'fresh-produce-box', sourceUrl: `${BASE_URL}/categories.aspx?cid=586` },
  { categoryId: 'fresh-cake', sourceUrl: `${BASE_URL}/categories.aspx?cid=698` },
  { categoryId: 'frozen', sourceUrl: `${BASE_URL}/categories.aspx?cid=580` },
  { categoryId: 'frozen-bundle', sourceUrl: `${BASE_URL}/package.aspx?types=1` },
  { categoryId: 'frozen-flash', sourceUrl: `${BASE_URL}/categories.aspx?cid=626` },
  { categoryId: 'frozen-meat', sourceUrl: `${BASE_URL}/categories.aspx?cid=582` },
  { categoryId: 'frozen-seafood', sourceUrl: `${BASE_URL}/categories.aspx?cid=583` },
  { categoryId: 'frozen-ready', sourceUrl: `${BASE_URL}/categories.aspx?cid=584` },
  { categoryId: 'frozen-quick-cook', sourceUrl: `${BASE_URL}/categories.aspx?cid=678` },
  { categoryId: 'frozen-vegetarian', sourceUrl: `${BASE_URL}/categories.aspx?cid=679` },
  { categoryId: 'frozen-breakfast', sourceUrl: `${BASE_URL}/categories.aspx?cid=680` },
  { categoryId: 'nuts', sourceUrl: `${BASE_URL}/categories.aspx?cid=590` },
  { categoryId: 'nuts-mixed', sourceUrl: `${BASE_URL}/categories.aspx?cid=591` },
  { categoryId: 'nuts-dried-fruits', sourceUrl: `${BASE_URL}/categories.aspx?cid=592` },
  { categoryId: 'snacks', sourceUrl: `${BASE_URL}/categories.aspx?cid=143` },
  { categoryId: 'grains', sourceUrl: `${BASE_URL}/categories.aspx?cid=145` },
  { categoryId: 'grains-rice', sourceUrl: `${BASE_URL}/categories.aspx?cid=221` },
  { categoryId: 'grains-cereal', sourceUrl: `${BASE_URL}/categories.aspx?cid=222` },
  { categoryId: 'grains-noodles', sourceUrl: `${BASE_URL}/categories.aspx?cid=475` },
  { categoryId: 'grains-beans', sourceUrl: `${BASE_URL}/categories.aspx?cid=594` },
  { categoryId: 'beverage', sourceUrl: `${BASE_URL}/categories.aspx?cid=154` },
  { categoryId: 'beverage-ready', sourceUrl: `${BASE_URL}/categories.aspx?cid=235` },
  { categoryId: 'beverage-brew', sourceUrl: `${BASE_URL}/categories.aspx?cid=236` },
  { categoryId: 'pantry', sourceUrl: `${BASE_URL}/categories.aspx?cid=152` },
  { categoryId: 'pantry-oil', sourceUrl: `${BASE_URL}/categories.aspx?cid=597` },
  { categoryId: 'pantry-seasoning', sourceUrl: `${BASE_URL}/categories.aspx?cid=598` },
  { categoryId: 'pantry-dry-goods', sourceUrl: `${BASE_URL}/categories.aspx?cid=599` },
  { categoryId: 'pantry-cookware', sourceUrl: `${BASE_URL}/categories.aspx?cid=715` },
  { categoryId: 'supplements', sourceUrl: `${BASE_URL}/categories.aspx?cid=576` },
  { categoryId: 'daily', sourceUrl: `${BASE_URL}/categories.aspx?cid=653` },
  { categoryId: 'daily-personal-care', sourceUrl: `${BASE_URL}/categories.aspx?cid=654` },
  { categoryId: 'daily-home', sourceUrl: `${BASE_URL}/categories.aspx?cid=655` },
  { categoryId: 'elderly', sourceUrl: `${BASE_URL}/categories.aspx?cid=664` },
  { categoryId: 'elderly-breakfast', sourceUrl: `${BASE_URL}/categories.aspx?cid=666` },
  { categoryId: 'elderly-dinner', sourceUrl: `${BASE_URL}/categories.aspx?cid=667` },
  { categoryId: 'elderly-soup', sourceUrl: `${BASE_URL}/categories.aspx?cid=669` },
  { categoryId: 'elderly-snacks', sourceUrl: `${BASE_URL}/categories.aspx?cid=670` },
  { categoryId: 'elderly-drinks', sourceUrl: `${BASE_URL}/categories.aspx?cid=671` },
  { categoryId: 'elderly-supplements', sourceUrl: `${BASE_URL}/categories.aspx?cid=673` },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function absoluteUrl(value, baseUrl) {
  try {
    return new URL(value, baseUrl).toString()
  } catch (_error) {
    return ''
  }
}

function extractAdvertisingBlock(html) {
  const match = html.match(/<div id=["']Advertising["'][^>]*>([\s\S]*?)(?:<div class=["']product_category|<div class=["']product_list|<div class=["']page|<footer)/i)
  return match ? match[1] : ''
}

function extractEntries(html, pageUrl) {
  const block = extractAdvertisingBlock(html)
  const entries = []
  const pattern = /<a\b[^>]*href=["']([^"']*)["'][^>]*>[\s\S]*?<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi
  let match
  while ((match = pattern.exec(block))) {
    const imageUrl = absoluteUrl(match[2], pageUrl)
    const linkUrl = absoluteUrl(match[1], pageUrl)
    const isFallbackThumb = /\/product_image\//i.test(imageUrl)
    entries.push({
      imageUrl,
      linkUrl,
      kind: isFallbackThumb ? 'thumb-fallback' : 'banner',
    })
  }
  return entries
}

function toRelativePath(filePath) {
  return path.relative(ROOT_DIR, filePath).split(path.sep).join('/')
}

function fileExtension(url, contentType) {
  const parsedExt = path.extname(new URL(url).pathname).toLowerCase()
  if (parsedExt === '.jpeg') return '.jpg'
  if (['.jpg', '.png', '.gif', '.webp'].includes(parsedExt)) return parsedExt
  if (contentType.includes('png')) return '.png'
  if (contentType.includes('webp')) return '.webp'
  if (contentType.includes('gif')) return '.gif'
  return '.jpg'
}

async function copyIfNeeded(sourcePath, targetPath) {
  if (path.resolve(sourcePath) === path.resolve(targetPath)) return
  await fs.copyFile(sourcePath, targetPath)
}

async function writeImage(url, outputPath) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'organicshops-ui category banner downloader',
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  const ext = fileExtension(url, response.headers.get('content-type') || '')
  const normalizedPath = outputPath.replace(/\.[^.]+$/, ext)
  await fs.mkdir(path.dirname(normalizedPath), { recursive: true })
  await fs.writeFile(normalizedPath, buffer)
  return { outputPath: normalizedPath, bytes: buffer.length, ext }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true })

  const report = {
    generatedAt: new Date().toISOString(),
    categories: [],
  }

  const seenUrls = new Map()

  for (const page of PAGES) {
    const response = await fetch(page.sourceUrl, {
      headers: {
        'user-agent': 'organicshops-ui category banner downloader',
        accept: 'text/html,application/xhtml+xml',
      },
    })
    const html = await response.text()
    const entries = extractEntries(html, page.sourceUrl)
    const categoryDir = path.join(OUTPUT_DIR, page.categoryId)
    await fs.mkdir(categoryDir, { recursive: true })

    const formalBanners = entries.filter((entry) => entry.kind === 'banner')
    const thumbFallbacks = entries.filter((entry) => entry.kind === 'thumb-fallback')
    const downloads = []

    const chosenBanners = formalBanners.slice(0, 2)
    for (let index = 0; index < chosenBanners.length; index += 1) {
      const entry = chosenBanners[index]
      const key = entry.imageUrl
      const filename = `banner-${String(index + 1).padStart(2, '0')}.jpg`
      const targetPath = path.join(categoryDir, filename)
      const cached = seenUrls.get(key)
      if (cached) {
        await copyIfNeeded(cached.outputPath, targetPath)
        downloads.push({ ...entry, fileName: filename, localPath: toRelativePath(targetPath), status: 'copied-from-cache' })
        continue
      }
      const result = await writeImage(entry.imageUrl, targetPath)
      seenUrls.set(key, result)
      downloads.push({ ...entry, fileName: path.basename(result.outputPath), localPath: toRelativePath(result.outputPath), status: 'downloaded', bytes: result.bytes })
      await sleep(REQUEST_DELAY_MS)
    }

    const thumbSource = formalBanners[0] || thumbFallbacks[0] || entries[0]
    if (thumbSource) {
      const key = thumbSource.imageUrl
      const targetPath = path.join(categoryDir, 'thumb.jpg')
      const cached = seenUrls.get(key)
      if (cached) {
        await copyIfNeeded(cached.outputPath, targetPath)
        downloads.push({ ...thumbSource, fileName: 'thumb.jpg', localPath: toRelativePath(targetPath), status: 'copied-from-cache-thumb' })
      } else {
        const result = await writeImage(thumbSource.imageUrl, targetPath)
        seenUrls.set(key, result)
        downloads.push({ ...thumbSource, fileName: path.basename(result.outputPath), localPath: toRelativePath(result.outputPath), status: 'downloaded-thumb', bytes: result.bytes })
      }
    }

    report.categories.push({
      categoryId: page.categoryId,
      sourceUrl: page.sourceUrl,
      bannerImage: formalBanners[0] ? toRelativePath(path.join(categoryDir, `banner-01${path.extname(formalBanners[0].imageUrl) || '.jpg'}`)) : '',
      bannerImages: chosenBanners.map((_, index) => toRelativePath(path.join(categoryDir, `banner-${String(index + 1).padStart(2, '0')}.jpg`))),
      formalBannerCount: formalBanners.length,
      thumbFallbackCount: thumbFallbacks.length,
      downloads,
    })
    await sleep(REQUEST_DELAY_MS)
  }

  const summary = {
    categoriesProcessed: report.categories.length,
    successfulImageCount: report.categories.reduce((sum, category) => sum + (category.downloads || []).filter((download) => download.status.startsWith('downloaded') || download.status.startsWith('copied')).length, 0),
    failedImageCount: report.categories.reduce((sum, category) => sum + (category.downloads || []).filter((download) => download.status === 'failed').length, 0),
    categoriesWithoutBanner: report.categories.filter((category) => !category.formalBannerCount).map((category) => ({
      categoryId: category.categoryId,
      sourceUrl: category.sourceUrl,
      localPaths: (category.downloads || []).map((download) => download.localPath),
    })),
    categoriesUsingFallback: report.categories
      .filter((category) => category.downloads.some((download) => download.kind === 'thumb-fallback' || download.status === 'downloaded-thumb' || download.status === 'copied-from-cache-thumb'))
      .map((category) => ({
        categoryId: category.categoryId,
        sourceUrl: category.sourceUrl,
        thumbnailPath: (category.downloads.find((download) => download.fileName === 'thumb.jpg') || {}).localPath || '',
      })),
    failedDownloads: [],
  }

  await fs.writeFile(REPORT_PATH, `${JSON.stringify({ ...summary, generatedAt: report.generatedAt, categories: report.categories }, null, 2)}\n`)
  console.log(JSON.stringify({
    ...summary,
    reportPath: path.relative(ROOT_DIR, REPORT_PATH),
    outputDir: path.relative(ROOT_DIR, OUTPUT_DIR),
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
