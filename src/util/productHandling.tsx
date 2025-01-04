import { Product } from "../types/types"

// checks if product is fit to be uploaded to dynamodb and s3
export const isValidProduct = (product: Product): {valid: boolean, message: string} => {
  if (!product.name) {
    return {valid: false, message: "Name is required"}
  } else if (parseInt(product.price) == 0) {
    return {valid: false, message: "Price is required"}
  } else if (!product.productType) {  
    return {valid: false, message: "Product type is required"}
  } else if (!product.season) {
    return {valid: false, message: "Season is required"}
  } else if (!product.keyContent) {
    return {valid: false, message: "Key content is required"}
  } else if (!product.description) {
    return {valid: false, message: "Description is required"}
  } else if (!product.mainImageFile) {
    return {valid: false, message: "Main image is required"}
  } else if (!product.clp) {
    return {valid: false, message: "CLP is required"}
  } else {
    return {valid: true, message: ""}
  }
}

export const isValidEditProduct = (product: Product): {valid: boolean, message: string} => {
  if (!product.name) {
    return {valid: false, message: "Name is required"}
  } else if (parseInt(product.price) == 0) {
    return {valid: false, message: "Price is required"}
  } else if (!product.productType) {  
    return {valid: false, message: "Product type is required"}
  } else if (!product.season) {
    return {valid: false, message: "Season is required"}
  } else if (!product.keyContent) {
    return {valid: false, message: "Key content is required"}
  } else if (!product.description) {
    return {valid: false, message: "Description is required"}
  } else if (!product.mainImageFile && !product.mainImageUrl) {
    return {valid: false, message: "Main image is required"}
  } else if (!product.clp) {
    return {valid: false, message: "CLP is required"}
  } else {
    return {valid: true, message: ""}
  }
}