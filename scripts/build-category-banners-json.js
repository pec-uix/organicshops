#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const reportPath = path.join(rootDir, 'export/category-banner-report.json')
const outputPath = path.join(rootDir, 'src/data/category-banners.json')

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

const output = {}

for (const category of report.categories || []) {
  const bannerImages = (category.downloads || [])
    .filter((item) => item.fileName && item.fileName.startsWith('banner-'))
    .sort((a, b) => a.fileName.localeCompare(b.fileName))
    .map((item) => item.localPath.replace('/public', ''))

  const thumb = (category.downloads || []).find((item) => item.fileName === 'thumb.jpg')
  const bannerImage = bannerImages[0] || (thumb ? thumb.localPath.replace('/public', '') : '')
  const bannerImageList = bannerImages.length ? bannerImages : (thumb ? [thumb.localPath.replace('/public', '')] : [])

  output[category.categoryId] = {
    bannerImage,
    bannerImages: bannerImageList,
    sourceUrl: category.sourceUrl,
  }
}

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`)

console.log(JSON.stringify({
  writtenTo: path.relative(rootDir, outputPath),
  categoryCount: Object.keys(output).length,
}, null, 2))
