import { Category } from '@/types'

function normalize(value: string): string {
  return decodeURIComponent(String(value || '').trim())
}

function categoryLabelMatches(category: Category, value: string): boolean {
  const normalized = normalize(value)
  return [category.name, category.id, category.slug || '']
    .filter(Boolean)
    .some((candidate) => normalize(candidate) === normalized)
}

export function resolveCategoryTrail(categories: Category[], segments: string[]): Category[] {
  const trail: Category[] = []
  let parentId: string | null = null

  for (const segment of segments) {
    const match = categories.find((category) => {
      if (category.isVisible === false) return false
      if ((category.parentId || null) !== parentId) return false
      return categoryLabelMatches(category, segment)
    })

    if (!match) break
    trail.push(match)
    parentId = match.id
  }

  return trail
}

export function buildCategoryPathFromSegments(segments: string[]): string {
  const safeSegments = segments
    .map((segment) => normalize(segment))
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))

  return safeSegments.length ? `/category/${safeSegments.join('/')}` : '/products'
}

export function buildCategoryPathFromTrail(trail: Category[]): string {
  return buildCategoryPathFromSegments(trail.map((category) => category.slug || category.id))
}

export function buildCategoryPathFromCategory(categories: Category[], categoryId: string): string {
  const trail = buildCategoryTrail(categories, categoryId)
  return buildCategoryPathFromTrail(trail)
}

export function buildCategoryTrail(categories: Category[], categoryId: string): Category[] {
  const trail: Category[] = []
  let current = categories.find((category) => category.id === categoryId)

  while (current) {
    trail.unshift(current)
    current = current.parentId
      ? categories.find((category) => category.id === current?.parentId)
      : undefined
  }

  return trail
}

export function trailLabelsFromRoute(categories: Category[], segments: string[]): string[] {
  const trail = resolveCategoryTrail(categories, segments)
  return trail.map((category) => category.name)
}

