import { OurStoryPageData } from "../types/types"
import { uploadToDynamoDB } from "./general.api"
import { PresignedPutUrlParams, uploadImageToS3 } from "./shop.api"


let params: PresignedPutUrlParams = {
  fileName: "",
  fileType: "",
  objectKey: ""
}
export const uploadOurStoryPage = async (ourStoryPage: OurStoryPageData) => {

  

  const isValid = isDataValid(ourStoryPage)
  if (!isValid.valid){
    throw new Error(`${isValid.message}`)
  }
  
  try {
    // 1. handles images for each section. Check if new files need to uploaded and overwritten
    for (const article of ourStoryPage.articles){
      if (article.imageFile){
        const file = article.imageFile
        params = {
          fileName: file.name,
          fileType: file.type,
          objectKey: `ourStoryArticles/${article.articleId}`
        }

        const objKey = await uploadImageToS3(params, file)

        article.imageUrl = objKey
        // prevents unneeded uplaods to s3 in future
        article.imageFile = undefined
        
      }
    }

    // 2. uplaoad object to dynamo
    const res = await uploadToDynamoDB<OurStoryPageData>(ourStoryPage, "/ourStory")
    return res
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}

const isDataValid = (data: OurStoryPageData) => {
  if (data.pageDescription === ""){
    return {
      valid: false,
      message: "Page Description Is Missing!"
    }
  }
  return {
    valid: true,
    message: ""
  }
}