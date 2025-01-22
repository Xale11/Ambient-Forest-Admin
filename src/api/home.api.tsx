import { HomePageData } from "../types/types"
import { uploadToDynamoDB } from "./general.api"
import { PresignedPutUrlParams, uploadImageToS3 } from "./shop.api"

let params: PresignedPutUrlParams = {
  fileName: "",
  fileType: "",
  objectKey: ""
}

export const uploadHomePage = async (homePage: HomePageData) => {
  
  try {
    // 1. handles image for home page. Check if new file needs to uploaded and overwritten
    if (homePage.mainImgFile){
      const file = homePage.mainImgFile
      params = {
        fileName: file.name,
        fileType: file.type,
        objectKey: `homePageMainImage`
      }

      const objKey = await uploadImageToS3(params, file)

      homePage.mainImgUrl = objKey
      // prevents unneeded uplaods to s3 in future
      homePage.mainImgFile = undefined
      
    }

    // 2. uplaoad object to dynamo
    const res = await uploadToDynamoDB<HomePageData>(homePage, "/home")
    return res
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}