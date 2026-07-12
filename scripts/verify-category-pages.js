#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path')

const CHROME_DEBUG_URL = 'http://127.0.0.1:9222'
const APP_BASE_URL = 'http://127.0.0.1:8081'
const OUTPUT_DIR = '/private/tmp/organicshops-ui-category-verification'

const ROOT_PAGES = [
  { id: 'fresh', name: '生鮮直送', path: '/category/%E7%94%9F%E9%AE%AE%E7%9B%B4%E9%80%81' },
  { id: 'frozen', name: '冷凍食材', path: '/category/%E5%86%B7%E5%87%8D%E9%A3%9F%E6%9D%90' },
  { id: 'nuts', name: '堅果/果乾', path: '/category/%E5%A0%85%E6%9E%9C%E6%9E%9C%E4%B9%BE' },
  { id: 'grains', name: '主食雜糧', path: '/category/%E4%B8%BB%E9%A3%9F%E9%9B%9C%E7%B3%A7' },
  { id: 'beverage', name: '即飲/沖泡', path: '/category/%E5%8D%B3%E9%A3%B2%2F%E6%B2%96%E6%B3%A1' },
  { id: 'pantry', name: '廚房料理品', path: '/category/%E5%BB%9A%E6%88%BF%E6%96%99%E7%90%86%E5%93%81' },
  { id: 'daily', name: '生活日用', path: '/category/%E7%94%9F%E6%B4%BB%E6%97%A5%E7%94%A8' },
  { id: 'elderly', name: '銀髮專區', path: '/category/%E9%8A%80%E9%AB%AE%E5%B0%88%E5%8D%80' },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1400, mobile: false },
  { name: 'mobile', width: 390, height: 1200, mobile: true },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`)
  }
  return response.json()
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl)
  let id = 0
  const pending = new Map()
  const listeners = new Map()

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve)
    socket.addEventListener('error', reject)
  })

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const item = pending.get(message.id)
      if (!item) return
      pending.delete(message.id)
      if (message.error) item.reject(new Error(message.error.message || 'CDP error'))
      else item.resolve(message.result)
      return
    }
    const handlers = listeners.get(message.method) || []
    handlers.forEach((handler) => handler(message.params))
  })

  socket.addEventListener('close', () => {
    for (const item of pending.values()) {
      item.reject(new Error('CDP socket closed'))
    }
    pending.clear()
  })

  function send(method, params = {}) {
    return ready.then(() => new Promise((resolve, reject) => {
      const messageId = ++id
      pending.set(messageId, { resolve, reject })
      socket.send(JSON.stringify({ id: messageId, method, params }))
    }))
  }

  function on(method, handler) {
    if (!listeners.has(method)) listeners.set(method, [])
    listeners.get(method).push(handler)
  }

  return { send, on, socket }
}

function decodeConsoleArg(arg) {
  if (typeof arg.value === 'string') return arg.value
  if (typeof arg.value === 'number' || typeof arg.value === 'boolean') return String(arg.value)
  return arg.description || ''
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function captureScreenshot(client, filePath) {
  const result = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
  await fs.writeFile(filePath, Buffer.from(result.data, 'base64'))
}

async function main() {
  await ensureDir(OUTPUT_DIR)
  const targets = await getJson(`${CHROME_DEBUG_URL}/json/list`)
  const pageTarget = targets.find((target) => target.type === 'page')
  if (!pageTarget) throw new Error('No page target found in Chrome DevTools')

  const client = createCdpClient(pageTarget.webSocketDebuggerUrl)
  await client.send('Page.enable')
  await client.send('Runtime.enable')
  await client.send('Log.enable')
  await client.send('Network.enable')
  await client.send('DOM.enable')

  const logs = []
  const errors = []
  const pageErrors = []
  const networkFailures = []

  client.on('Runtime.consoleAPICalled', (event) => {
    if (event.type === 'error') {
      errors.push({
        type: 'console',
        text: event.args.map(decodeConsoleArg).join(' '),
      })
    }
  })
  client.on('Runtime.exceptionThrown', (event) => {
    pageErrors.push({
      type: 'exception',
      text: event.exceptionDetails?.exception?.description || event.exceptionDetails?.text || 'Unknown exception',
    })
  })
  client.on('Log.entryAdded', (event) => {
    if (event.entry.level === 'error') {
      errors.push({
        type: 'log',
        text: event.entry.text,
      })
    }
  })
  client.on('Network.loadingFailed', (event) => {
    if (!event.canceled && event.type === 'Image') {
      networkFailures.push({
        url: event.url,
        errorText: event.errorText,
      })
    }
  })

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1400,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await client.send('Page.navigate', { url: `${APP_BASE_URL}/` })
  await sleep(2500)

  const results = []
  for (const viewport of VIEWPORTS) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    })

    for (const page of ROOT_PAGES) {
      const url = `${APP_BASE_URL}${page.path}`
      errors.length = 0
      pageErrors.length = 0
      networkFailures.length = 0

      await client.send('Page.navigate', { url })
      await sleep(4000)

      const evaluation = await client.send('Runtime.evaluate', {
        expression: `(() => {
          const rootName = ${JSON.stringify(page.name)}
          const hero = document.querySelector('img[alt="' + rootName + '"]')
          const heroRect = hero ? hero.getBoundingClientRect() : null
          const heroStyle = hero ? getComputedStyle(hero) : null
          const allImages = Array.from(document.images).map((img) => ({
            alt: img.alt || '',
            src: img.currentSrc || img.src || '',
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            visible: !!(img.getClientRects().length && img.getBoundingClientRect().width > 0 && img.getBoundingClientRect().height > 0),
          }))
          const visibleImages = allImages.filter((img) => img.visible)
          const brokenVisibleImages = visibleImages.filter((img) => img.complete && img.naturalWidth === 0)
          const localImages = visibleImages.filter((img) => img.src.includes('/category-banners/'))
          return {
            title: document.title,
            hero: hero ? {
              src: hero.currentSrc || hero.src || '',
              complete: hero.complete,
              naturalWidth: hero.naturalWidth,
              naturalHeight: hero.naturalHeight,
              objectFit: heroStyle ? heroStyle.objectFit : '',
              rect: heroRect ? {
                width: heroRect.width,
                height: heroRect.height,
              } : null,
            } : null,
            visibleImages,
            brokenVisibleImages,
            localImages,
            bodyText: document.body.innerText.slice(0, 500),
          }
        })()`,
        returnByValue: true,
      })

      const captureDir = path.join(OUTPUT_DIR, viewport.name)
      await ensureDir(captureDir)
      await captureScreenshot(client, path.join(captureDir, `${page.id}.png`))

      const value = evaluation.result.value
      const heroPath = value.hero ? (() => {
        try { return new URL(value.hero.src).pathname } catch (_error) { return value.hero.src || '' }
      })() : ''

      results.push({
        viewport: viewport.name,
        categoryId: page.id,
        categoryName: page.name,
        url,
        heroVisible: Boolean(value.hero),
        heroLocalPath: heroPath,
        heroLoaded: value.hero ? value.hero.complete && value.hero.naturalWidth > 0 : false,
        heroObjectFit: value.hero ? value.hero.objectFit : '',
        heroHeight: value.hero?.rect?.height || 0,
        heroWidth: value.hero?.rect?.width || 0,
        localImageCount: value.localImages.length,
        brokenVisibleImageCount: value.brokenVisibleImages.length,
        consoleErrors: [...errors],
        pageErrors: [...pageErrors],
        networkFailures: [...networkFailures],
      })
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    results,
    screenshotsDir: OUTPUT_DIR,
  }

  await fs.writeFile(path.join(OUTPUT_DIR, 'category-page-verification.json'), `${JSON.stringify(summary, null, 2)}\n`)
  console.log(JSON.stringify({
    results: results.length,
    screenshotsDir: OUTPUT_DIR,
    report: path.join(OUTPUT_DIR, 'category-page-verification.json'),
  }, null, 2))
  client.socket.close()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
