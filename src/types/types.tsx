// should be the same as client repo
export interface Product {
  productType: "candle" | "tealight" | "giftset" // partition key
  productId: string // sort key
  season: "spring" | "summer" | "autumn" | "winter",
  name: string,
  keyContent: string
  price: string
  description: string
  mainImageUrl: string
  mainImageFile?: File
  secondaryImageUrl?: string
  secondaryImageFile?: File
  notes?: {
    topNotes?: {
      color?: string,
      content: string
    },
    heartNotes?: {
      color?: string,
      content: string
    },
    baseNotes?: {
      color?: string,
      content: string
    }
  },
  createdAt: string,
  additionalImages: AdditionalImage[],
  clp: string
  isSoldOut: boolean
  hideProduct: boolean
}

export interface AdditionalImage {
  imageUrl: string
  additionalImageId: string
  additionalImageFile?: File
}

// Home Page 

export interface HomePageData {
  page: "home"
  mainImgUrl: string
  mainImgFile?: File
  bannerMessages: BannnerMessages
  productBanner: ProductBanner
}

export interface BannnerMessages{
  msg1: string
  msg2: string
  msg3: string
  msg4: string 
}

export interface ProductBanner {
  candle: {
      spring?: Product,
      summer?: Product,
      autumn?: Product,
      winter?: Product
  },
  tealight: {
    spring?: Product,
    summer?: Product,
    autumn?: Product,
    winter?: Product
  },
    giftset: {
      spring?: Product,
    summer?: Product,
    autumn?: Product,
    winter?: Product
  }
}

export interface ProductBannerSeasons {
  spring?: Product,
  summer?: Product,
  autumn?: Product,
  winter?: Product
}

// Our Story Page

export interface OurStoryPageData {
  page: "ourStory"
  articles: OurStoryArticle[]
  pageDescription: string
}

export interface OurStoryArticle {
  articleId: string
  title: string
  message: string
  imageUrl: string
  imageFile?: File
}

// Contact Page
export interface ContactPageData extends ContactList {
  page: "contact"
}

export interface ContactList {
  number: string
  location: string
  email: string
  twitter: string
  instagram: string
  linkedin: string
  pinterest: string
  facebook: string
  tiktok: string
}

// Terms Page

export interface TermsPageData {
  page: "terms"
  terms: TermsCondition[]
}

export interface TermsCondition {
  title: string
  content: string
}

// Cart Page

export interface CartPageData {
  page: "cart"
  deliveryOptions: DeliveryOption[]
}

export interface DeliveryOption {
  name: string,
  price: string,
  shipMax: string,
  shipMin: string,
}

export interface ShippingRate {
  id?: string,
  name: string,
  price: number,
  shipMax: number,
  shipMin: number,
}