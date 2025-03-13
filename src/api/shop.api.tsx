import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AdditionalImage, Product } from '../types/types';

export interface PresignedPutUrlParams {
  fileName: string
  fileType: string
  objectKey: string
}

const endpointUrl = import.meta.env.PROD ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_DEV_API_URL

export const uploadProduct = async (product: Product) => {
  
  let mainImageUrl = ""
  let secondaryImageUrl = ""
  const additionalImages: AdditionalImage[] = [] 

  //check that the main image file exists
  if (product.mainImageFile === undefined){
    return new Error("Main image file is required")
  }

  try {    
    // 1. handle upload of main image

    // main image params
    let params = {
      fileName: product.mainImageFile?.name,
      fileType: product.mainImageFile?.type,
      objectKey: `${product.productId}/${product.productId}`
    }

    mainImageUrl = await uploadImageToS3(params, product.mainImageFile)

    // 2. handle upload of secondary image
    if (product.secondaryImageFile){
      params = {
        fileName: product.secondaryImageFile?.name,
        fileType: product.secondaryImageFile?.type,
        objectKey: `${product.productId}/secondaryImage`
      }

      secondaryImageUrl = await uploadImageToS3(params, product.secondaryImageFile)
    }

    // 3. handle upload of additional images
    for (const image of product.additionalImages){
      const uuid = uuidv4()
      if (image.additionalImageFile){
        params = {
          fileName: image.additionalImageFile?.name,
          fileType: image.additionalImageFile?.type,
          objectKey: `${product.productId}/additionalImages/${uuid}`
        }

        const objKey = await uploadImageToS3(params, image.additionalImageFile)

        additionalImages.push({
          additionalImageId: uuid,
          imageUrl: objKey
        })
      }
    }

    // 4. Upload product with s3 image urls. All file field should be empty
    const res = await uploadProductToDynamoDB({...product, mainImageUrl: mainImageUrl, secondaryImageUrl: secondaryImageUrl, additionalImages: additionalImages})
    return res

  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
  

}

export const updateProduct = async (product: Product) => {

  const additionalImages: AdditionalImage[] = []

  let params = {
    fileName: "",
    fileType: "",
    objectKey: ``
  }

  try {   
    // 1. handle upload of main image

    // main image params
    if (product.mainImageFile){
        params = {
        fileName: product.mainImageFile?.name,
        fileType: product.mainImageFile?.type,
        objectKey: `${product.productId}/${product.productId}`
      }
      const imgUrl = await uploadImageToS3(params, product.mainImageFile)
      product.mainImageUrl = imgUrl
      product.mainImageFile = undefined
    }
    

    // 2. handle upload of secondary image
    if (product.secondaryImageFile){
      params = {
        fileName: product.secondaryImageFile?.name,
        fileType: product.secondaryImageFile?.type,
        objectKey: `${product.productId}/secondaryImage`
      }
      const imgUrl = await uploadImageToS3(params, product.secondaryImageFile)

      product.secondaryImageUrl = imgUrl
      product.secondaryImageFile = undefined
    }


    // 3. handle upload of additional images 
    for (const image of product.additionalImages){
      if (image.additionalImageFile){
        params = {
          fileName: image.additionalImageFile?.name,
          fileType: image.additionalImageFile?.type,
          objectKey: `${product.productId}/additionalImages/${image.additionalImageId}`
        }
        const objKey = await uploadImageToS3(params, image.additionalImageFile)

        additionalImages.push({
          additionalImageId: image.additionalImageId,
          imageUrl: objKey
        })
      } 
    else {
        additionalImages.push({
          additionalImageId: image.additionalImageId,
          imageUrl: image.imageUrl
        })
      }
    }

    // 4. Upload product with s3 image urls. All file field should be empty
    const res = await uploadProductToDynamoDB({...product, additionalImages: additionalImages})
    return res

  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}

export const generatePresignedPutUrl = async (params: PresignedPutUrlParams) => {
  try {
    const res = await axios.get(`${endpointUrl}/aws`, {
      params: {
        fileName: params.fileName,
        fileType: params.fileType,
        objectKey: params.objectKey
      }
    })
    return res.data.url
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}

export const uploadImageToS3 = async (params: PresignedPutUrlParams, file: File) => {

  try {
    // fetch presigned url
    const presignedUrl = await generatePresignedPutUrl(params)
    const res = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': params.fileType
      }
    })
    // returns the object key if the upload was successful. Object is appended to s3 bucket url to load the image
    if (res.status === 200){
      return params.objectKey
    } else {
      throw new Error(`Error uploading image, object Key: ${params.objectKey}`)
    }
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
  
}

export function readFileAsBinaryAsync(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
          if (reader.result) {
              const binaryData = new Uint8Array(reader.result as ArrayBuffer);
              resolve(binaryData);  // Resolve the promise with the binary data
          } else {
              reject(new Error("Failed to read file"));
          }
      };
      
      reader.onerror = () => {
          reject(new Error("Error reading file"));
      };
      
      reader.readAsArrayBuffer(file);  // Start reading the file
  });
}

export const uploadProductToDynamoDB = async (product: Product) => {
  try {
    const res = await axios.put(`${endpointUrl}/products`, product)
    if (res.data.statusCode === 200){
      return res.data
    } else {
      throw new Error(`${res.data.body}`)
    }
    
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}

export const getProductsByTypeFromDynamoDB = async (type: string) => {
  try {
    const res = await axios.get(`${endpointUrl}/products/item/${type}`)
    return res.data
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
} 

export const getProductByTypeAndIdFromDynamoDB = async (type: string, id: string) => {
  try {
    const res = await axios.get(`${endpointUrl}/products/item/${type}/${id}`)
    return res.data
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
} 

export async function deleteProductFromDynamoDB(productType: string, productId: string) {
  try {
    const res = await axios.delete(`${endpointUrl}/products/item/${productType}/${productId}`)
    if (res.status === 200){
      return "success"
    } else {
      throw new Error(`${res.statusText}`)
    }
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}