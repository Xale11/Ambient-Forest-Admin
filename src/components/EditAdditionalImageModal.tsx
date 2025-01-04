import { Button, ButtonGroup, Flex, Image, Input, Text, VStack } from '@chakra-ui/react'
import {  useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AdditionalImage } from '../types/types'
import { deleteFromS3 } from '../api/general.api'
import { useQuery } from '@tanstack/react-query'

interface Props {
  additionalImages: AdditionalImage[]
  setAdditionalImages: (value: AdditionalImage[]) => void
  presetUrl?: string
  onClose: () => void
  index: number | null
  saveFunction: () => void
}



const EditAdditionalImageModal = ({additionalImages, setAdditionalImages, onClose, presetUrl, index, saveFunction}: Props) => {

  const fileRef = useRef<HTMLInputElement>(null)

  const [imageUrl, setImageUrl] = useState<string>(presetUrl ? presetUrl : "")
  const [deleteKey, setDeleteKey] = useState<string>("")

  const openFileInput = () => {
    if (fileRef.current){
      fileRef.current.click()
    }
  }

  const uploadNewFile = () => {
    if (fileRef.current && fileRef.current.files){
      setImageUrl(URL.createObjectURL(fileRef.current.files[0]))
    }
    
  }

  const removeImage = () => {
    setImageUrl("")
    if (fileRef.current){
      fileRef.current.value = ""
    }
  }

  const saveChanges = async () => {
    if (index != null){
      if (!imageUrl && !fileRef?.current?.files?.[0]){
          // deletion
          const imageToDelete = additionalImages[index]
          setDeleteKey(imageToDelete.imageUrl)
          const arr = [...additionalImages]
          arr.splice(index, 1)
          // upload new array first
          setAdditionalImages(arr)
          // upload function
          setTimeout(() => saveFunction(), 1000)
          // then delete from s3
          setTimeout(async () => await deleteRefetch(), 1000)
          

      } else if (fileRef?.current?.files?.[0]){
        
        // update
        const arr = [...additionalImages]
        arr[index].additionalImageFile = fileRef.current.files[0]
        setAdditionalImages(arr)
        // call upload function
        // Needed a slight delay to let state update
        setTimeout(() => saveFunction(), 1000)
      } else {
        onClose()
      }

    } else {
      // append and upload
      const arr = [...additionalImages]
      const uuid = uuidv4()
      arr.push({
        additionalImageId: uuid,
        imageUrl: "",
        additionalImageFile: fileRef?.current?.files?.[0]
      })
      setAdditionalImages(arr)
      // call upload function
      // Needed a slight delay to let state update
      setTimeout(() => saveFunction(), 1000)
      
      
    }
    onClose()
  }

  const {isFetching: deleteLoading, isError: deleteError, refetch: deleteRefetch, isSuccess: deleteSuccess, isFetchedAfterMount: deletedAfterMount} = useQuery({queryKey: ["deleteProduct"], queryFn: () => deleteFromS3(deleteKey), enabled: false})

  useEffect(() => {
    if (presetUrl){
      setImageUrl(presetUrl)
    }
  }, [presetUrl])

  useEffect(() => {
    if (!deleteLoading && deleteSuccess && deletedAfterMount){
      console.log("delete success")
    }

    if (!deleteLoading && deleteError && deletedAfterMount){
      console.log("delete failed")
    }
  }, [deleteLoading])

  console.log(additionalImages, index)

  return (
    <VStack bg={"white"} w={"100%"} mt={10} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"start"}>
      <Flex bg={"primary"} w={"40%"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
        {imageUrl !== "" && <Image src={imageUrl} maxW={"100%"} maxH={"100%"} objectFit={"contain"} alt='Image of the product'/>}
        {imageUrl === "" && <Text textAlign={"center"}>No Image Added</Text>}
      </Flex>
      <ButtonGroup>
        <Button onClick={openFileInput}>
          <Text>Upload New Image</Text>
          <Input onChange={uploadNewFile} display={"none"} type='file' w={"min-content"} maxW={"100%"} h={"min-content"} p={0} m={0} name={`${name}`} borderRadius={"0.5em"} ref={fileRef}/>
        </Button>
        <Button onClick={removeImage}>Remove Image</Button>
        <Button isDisabled={!imageUrl && index == null} onClick={saveChanges}>Save Changes</Button>
      </ButtonGroup>
    </VStack>
  )
}

export default EditAdditionalImageModal
