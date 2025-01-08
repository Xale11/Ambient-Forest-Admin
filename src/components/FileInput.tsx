import { Box, Button, Flex, FormLabel, HStack, IconButton, Image, Input, Modal, ModalContent, ModalOverlay, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import ImageControlModal from './ImageControlModal';
import AreYouSureBtn from './AreYouSureBtn';

interface Props {
  variant: number
  label: string
  w?: string,
  mt?: string|number
  id: string,
  name: string,
  placeholder?: string
  value: FileList|undefined
  setValue: (value: FileList | undefined) => void
  presetUrl?: string
  edit?: boolean
  editFunction?: () => void
}

const FileInput = ({variant, label, w, id, name, value, setValue, presetUrl, mt, edit, editFunction}: Props) => {

  const {isOpen, onOpen, onClose} = useDisclosure()

  const baseImageUrl = import.meta.env.VITE_USE_CLOUDFRONT === "true" ? import.meta.env.VITE_CLOUDFRONT_URL : import.meta.env.VITE_S3_URL

  const imageRef = useRef<HTMLInputElement>(null)
  // const fileRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [choiceIndex, setChoiceIndex] = useState<number|null>(null)
  // const [imageFiles, setImageFiles] = useState<FileList|undefined>(undefined)
  // const [imageUrls, setImageUrls] = useState<string[]>([])

  const resetImage = () => {
    setImageUrl(`${baseImageUrl}/${presetUrl}`)
    if (imageRef.current) {
      imageRef.current.value = ""
    }
    setValue(undefined)
  }

  useEffect(() => {
    if (value && value.length > 0){
      setImageUrl(URL.createObjectURL(value[0]))
    } else if (presetUrl) {
      setImageUrl(`${baseImageUrl}/${presetUrl}`)
    } else {
      setImageUrl("")
    }
  }, [value, presetUrl])

  return (
    <Box w={`${w ? w : "95%"}`} mt={mt ? mt : 0}>
      {variant == 1 && <VStack  borderRadius={"0.5em"} p={"0em 0.5em"} align={"center"} justify={"center"} spacing={"0.25em"}>
        <Flex bg={"primary"} w={"100%"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
          {imageUrl !== "" && <Image src={imageUrl} w={"100%"} aspectRatio={"1 / 1"} objectFit={"contain"} alt='Image of the product'/>}
          {imageUrl === "" && <Text textAlign={"center"}>No Image Added</Text>}
        </Flex>
        <FormLabel m={0} textAlign={"center"}>{label}</FormLabel>
        <VStack bg={"primary"} w={"100%"} borderRadius={"0.5em"} p={"0.5em"}>
          <Input onChange={(e) => setValue(e.target.files !== null ? e.target.files : undefined)} type='file' w={"min-content"} maxW={"100%"} h={"min-content"} p={0} m={0} name={`${name}`} id={`${id}`} borderRadius={"0.5em"} ref={imageRef}/>
          {edit && editFunction && <HStack w={"100%"} wrap={"wrap"} justify={"center"}>
            {presetUrl !== "" && <AreYouSureBtn onClick={() => editFunction()} w='45%' fontSize='sm' label="Delete Image" modalMessage="Are you sure want to delete this image? It cannot be undone! Bare in mind this will also save current changes you have made on this page."/>}
            <Button mt={3} onClick={() => (resetImage())} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"sm"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
              Revert Changes
            </Button>
          </HStack>}
            
        </VStack>
      </VStack>}
      {variant === 2 && <VStack w={"100%"} borderRadius={"0.5em"} p={"0em 0.5em"} align={"center"} justify={"center"} spacing={"0.25em"}>
        <FormLabel my={3} cursor={"pointer"}>{label}</FormLabel>
        <HStack w={"100%"} wrap={"wrap"}>
          {value && [...Array(value.length)].map((_, index) => {
            console.log(12, index)
            return (
              <Flex onClick={() => {setChoiceIndex(index); onOpen()}} bg={"primary"} h={"10em"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
                <Image src={URL.createObjectURL(value[index])} w={"100%"} aspectRatio={"1 / 1"} objectFit={"contain"} alt='Image of the product'/>
              </Flex>
            )
          })}
          <Flex bg={"primary"} h={"10em"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
            <IconButton onClick={() => {setChoiceIndex(null); onOpen()}} fontSize={"4xl"} bgColor={"rgba(0,0,0,0)"} aria-label='Add additional image' icon={<IoIosAddCircleOutline />} />
          </Flex>
        </HStack>
      </VStack>}
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay/>
        <ModalContent >
          <ImageControlModal index={choiceIndex} imageFiles={value} setImageFiles={setValue} onClose={onClose} presetUrl={presetUrl} />
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default FileInput