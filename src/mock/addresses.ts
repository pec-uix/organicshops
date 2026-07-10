export interface SavedAddress {
  id: number
  name: string
  phone: string
  zipCode?: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export const mockAddresses: SavedAddress[] = [
  {
    id: 1,
    name: '皮克敏',
    phone: '0912345678',
    zipCode: '710',
    city: '台南市',
    district: '永康區',
    detail: '中正路301號',
    isDefault: true
  },
  {
    id: 2,
    name: '王小明',
    phone: '0922333444',
    zipCode: '220',
    city: '新北市',
    district: '板橋區',
    detail: '文化路一段 188 號 12 樓',
    isDefault: false
  }
]
