import { Button, ButtonGroup, Flex, Image, Input, Text, VStack } from '@chakra-ui/react'
import {  useEffect, useRef, useState } from 'react'
import { addFileAtIndex, addNewFiles, removeFileAtIndex } from '../util/fileHandling'

interface Props {
  index: number|null
  imageFiles: FileList|undefined
  setImageFiles: (value: FileList | undefined) => void
  presetUrl?: string
  onClose: () => void
}



const ImageControlModal = ({imageFiles, setImageFiles, onClose, index, presetUrl}: Props) => {

  const fileRef = useRef<HTMLInputElement>(null)

  const [imageUrl, setImageUrl] = useState<string>(presetUrl ? presetUrl : "")
  const [tempImageFiles, setTempImageFiles] = useState<FileList|undefined>(imageFiles)

  const openFileInput = () => {
    if (fileRef.current){
      fileRef.current.click()
    }
  }

  const uploadNewUpload = () => {
    let file: FileList = new DataTransfer().files
    if (fileRef.current && fileRef.current.files){
      file = index === null ? addNewFiles(imageFiles, fileRef.current.files) : addFileAtIndex(imageFiles, fileRef.current.files, index)
    }
    setImageFiles(file)
    onClose()
  }

  const removeImage = () => {
    let file: FileList = new DataTransfer().files
    if (fileRef.current && fileRef.current.files && index !== null){
      file = removeFileAtIndex(imageFiles, index)
    }
    setTempImageFiles(file)
    setImageUrl("")
  }

  const saveChanges = () => {
    setImageFiles(tempImageFiles)
    onClose()
  }

  useEffect(() => {
      if (imageFiles && imageFiles.length > 0 && index !== null){
        setImageUrl(URL.createObjectURL(imageFiles[index]))
      } else {
        setImageUrl("")
      }
    }, [imageFiles, index])

  useEffect(() => {
    if (presetUrl){
      setImageUrl(presetUrl)
    }
  }, [presetUrl])


  return (
    <VStack bg={"white"} w={"100%"} mt={10} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"start"}>
      <Flex bg={"primary"} w={"40%"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
        {imageUrl !== "" && <Image src={imageUrl} maxW={"100%"} maxH={"100%"} objectFit={"contain"} alt='Image of the product'/>}
        {imageUrl === "" && <Text textAlign={"center"}>No Image Added</Text>}
      </Flex>
      <ButtonGroup>
        <Button onClick={openFileInput}>
          <Text>Upload New Image</Text>
          <Input onChange={uploadNewUpload} display={"none"} type='file' w={"min-content"} maxW={"100%"} h={"min-content"} p={0} m={0} name={`${name}`} borderRadius={"0.5em"} ref={fileRef}/>
        </Button>
        <Button onClick={removeImage}>Remove Image</Button>
        <Button onClick={saveChanges}>Save Changes</Button>
      </ButtonGroup>
    </VStack>
  )
}

export default ImageControlModal