import { Box, Flex, FormLabel, HStack, IconButton, Image, Modal, ModalContent, ModalOverlay, useDisclosure, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { AdditionalImage } from '../types/types'
import EditAdditionalImageModal from './EditAdditionalImageModal'

interface Props {
  label: string
  w?: string,
  mt?: string|number
  value: AdditionalImage[]
  setValue: (value: AdditionalImage[]) => void
  saveFunction: () => void
}

const EditadditionalImages = ({label, w, value, mt, setValue, saveFunction}: Props) => {

  const baseImgUrl = import.meta.env.VITE_USE_CLOUDFRONT === "true" ? import.meta.env.VITE_CLOUDFRONT_URL : import.meta.env.VITE_S3_URL
  

  const {isOpen, onOpen, onClose} = useDisclosure()

  const [choiceIndex, setChoiceIndex] = useState<number|null>(null)
  const [imgUrl, setImgUrl] = useState<string>("")

  const clearModalPresets = () => {
    setChoiceIndex(null)
    setImgUrl("")
  }

  return (
    <Box w={`${w ? w : "95%"}`} mt={mt ? mt : 0}>
      <VStack w={"100%"} borderRadius={"0.5em"} p={"0em 0.5em"} align={"center"} justify={"center"} spacing={"0.25em"}>
        <FormLabel my={3} cursor={"pointer"}>{label}</FormLabel>
        <HStack w={"100%"} wrap={"wrap"}>
          {value.map((additionalImage, i) => {
            return (
              <Flex onClick={() => {setChoiceIndex(i); setImgUrl(`${baseImgUrl}/${additionalImage.imageUrl}`); onOpen()}} bg={"primary"} h={"10em"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
                <Image src={additionalImage.additionalImageFile ? URL.createObjectURL(additionalImage.additionalImageFile) : `${baseImgUrl}/${additionalImage.imageUrl}?t=${Date.now()}`} w={"100%"} aspectRatio={"1 / 1"} objectFit={"contain"} alt='Image of the product'/>
              </Flex>
            )
          })}
          <Flex onClick={() => {clearModalPresets(); onOpen()}} bg={"primary"} h={"10em"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
            <IconButton fontSize={"4xl"} bgColor={"rgba(0,0,0,0)"} aria-label='Add additional image' icon={<IoIosAddCircleOutline />} />
          </Flex>
        </HStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay/>
        <ModalContent >
          <EditAdditionalImageModal index={choiceIndex} additionalImages={value} setAdditionalImages={setValue} onClose={onClose} presetUrl={imgUrl} saveFunction={saveFunction}/>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default EditadditionalImages
