export interface Product {
  name: string
  description: string
  reviews?: string[]
  extraInfo: string
  maxBuy: number
  basePrice: number
  color: ColorVariant[]
  mainImg?: string
  secondaryImg?: string
  allImgs?: string[]
}

interface ColorVariant {
  colorName: string
  sizes: SizeVariant[]
  colorPriceAddOn: number
}

interface SizeVariant {
  sizeName: string
  sizePriceAddOn: number
  stock: number
}

export const productTypeList =  [
  {
    label: "Candle",
    value: "candle",
  },
  {
    label: "Tealight",
    value: "tealight",
  },
  {
    label: "Giftset",
    value: "giftset",
  },
]

export const seasonList =  [
  {
    label: "Spring",
    value: "spring",
  },
  {
    label: "Summer",
    value: "summer",
  },
  {
    label: "Autumn",
    value: "autumn",
  },
  {
    label: "Winter",
    value: "winter",
  }
]