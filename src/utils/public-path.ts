const basePath = process.env.BASE_URL || '/'

export function publicAssetPath(path = ''): string {
  if (!path) return ''
  if (/^(https?:|data:|blob:|mailto:|tel:)/.test(path)) return path
  if (!path.startsWith('/')) return path
  if (basePath !== '/' && path.startsWith(basePath)) return path
  return `${basePath.replace(/\/$/, '')}${path}`
}

export function publicAssetHtml(html = ''): string {
  return html
    .replace(/\s(src|href)=["'](\/(?!\/)[^"']+)["']/g, (_match, attr, path) => ` ${attr}="${publicAssetPath(path)}"`)
    .replace(/url\((['"]?)(\/(?!\/)[^)'""]+)\1\)/g, (_match, quote, path) => `url(${quote}${publicAssetPath(path)}${quote})`)
}
