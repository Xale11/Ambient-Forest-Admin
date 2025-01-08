import axios from "axios"

const endpointUrl = import.meta.env.PROD ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_DEV_API_URL


export async function uploadToDynamoDB<T>(item: T, endpoint: string) {
  try {
    const res = await axios.put(`${endpointUrl}${endpoint}`, item)
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

export async function fetchFromDynamoDB(endpoint: string) {
  try {
    const res = await axios.get(`${endpointUrl}${endpoint}`)
    if (res.data.statusCode === 200){
      return typeof res.data.body === "string" ? JSON.parse(res.data.body) : res.data.body
    } else {
      throw new Error(`${res.data.body}`)
    }
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}

export async function deleteFromS3(objectKey: string) {
  try {
    const res = await axios.put(`${endpointUrl}/aws/delete`,{
      objectKey: objectKey
    })
    if (res.data.statusCode === 200){
      return typeof res.data.body === "string" ? JSON.parse(res.data.body) : res.data.body
    } else {
      throw new Error(`${res.data.body}`)
    }
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}

export async function deleteS3Folder(prefix: string) {
  try {
    const res = await axios.put(`${endpointUrl}/aws/delete/folder`,{
      prefix: prefix
    })
    if (res.data.statusCode === 200){
      return typeof res.data.body === "string" ? JSON.parse(res.data.body) : res.data.body
    } else {
      throw new Error(`${res.data.body}`)
    }
  } catch (error) {
    console.error(error)
    throw new Error(`${error}`)
  }
}