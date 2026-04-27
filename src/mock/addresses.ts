export interface SavedAddress {
  id: number
  name: string
  phone: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export const mockAddresses: SavedAddress[] = [
  {
    id: 1,
    name: '王大明',
    phone: '0912345678',
    city: '台北市',
    district: '大安區',
    detail: '和平東路二段 100 號 8 樓',
    isDefault: true
  },
  {
    id: 2,
    name: '王小明',
    phone: '0922333444',
    city: '新北市',
    district: '板橋區',
    detail: '文化路一段 188 號 12 樓',
    isDefault: false
  }
]
