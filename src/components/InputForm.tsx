import { Box, Button, Flex, FormLabel, HStack, Image, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Textarea, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  variant: number
  label: string
  w?: string,
  id: string,
  name: string,
  choiceArray?: {label: string, value: string}[]
  placeholder?: string
  value: string | number
  setValue: React.Dispatch<React.SetStateAction<string>>
  presetChoice?: string
}

const InputForm = ({variant, label, w, id, name, placeholder, value, setValue, choiceArray, presetChoice}: Props) => {

  const imageRef = useRef<HTMLInputElement>(null)

  const [fileImage, setFileImage] = useState<FileList|undefined>(undefined)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedChoice, setSelectedChoice] = useState<string>(presetChoice ?? "")

  const onSelectChoice = (choice: {label: string, value: string}) => {
    setSelectedChoice(choice.value)
    setValue(choice.value)
  }

  useEffect(() => {
    if (fileImage && fileImage.length > 0){
      setImageUrl(URL.createObjectURL(fileImage[0]))
    } else {
      setImageUrl("")
    }
  }, [fileImage])

  useEffect(() => {
    setSelectedChoice(presetChoice ?? "")
  }, [presetChoice])

  // console.log(fileImage)

  return (
    <Box w={`${w ? w : "95%"}`}>
      <FormLabel>{label}</FormLabel>
      {/* Simple Text Input */}
      {variant == 1 && <Input value={value} onChange={(e) => setValue(e.target.value)} bg={"primary"} p={"1.5em 0.5em"} name={`${name}`} id={`${id}`} placeholder={`${placeholder ? placeholder : 'Type here...'}`} borderRadius={"0.5em"} border={"none"} _focus={{boxShadow: "none"}}/>}
      {/* Textarea e.g. writing a writing a message */}
      {variant == 2 && <Textarea value={value} onChange={(e) => setValue(e.target.value)} bg={"primary"} name={`${name}`} id={`${id}`} placeholder={`${placeholder ? placeholder : 'Type here...'}`} h={"10em"} borderRadius={"0.5em"} border={"none"} _focus={{boxShadow: "none"}}/>}
      {/* Number Input with stepper control */}
      {variant == 3 && <NumberInput value={value} onChange={(valueString) => setValue(valueString)} defaultValue={0} precision={2} step={0.01} min={0} bg={"primary"}  name={`${name}`} id={`${id}`} borderRadius={"0.5em"} m={"0em"} p={"0.25em 0em"} border={"rgba(0, 0, 0, 0.0)"}>
        <NumberInputField _focus={{boxShadow: "none", border: "none"}}/>
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>}
      {/* File Input */}
      {variant == 4 && <VStack  borderRadius={"0.5em"} p={"1.5em 0.5em"} align={"center"} justify={"center"} spacing={"0.25em"}>
        <Flex bg={"primary"} w={"100%"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
          {imageUrl !== "" && <Image src={imageUrl} w={"100%"} aspectRatio={"1 / 1"} objectFit={"contain"} alt='Image of the product'/>}
          {imageUrl === "" && <Text textAlign={"center"}>No Image Added</Text>}
        </Flex>
        <FormLabel m={0}>{label}</FormLabel>
        <Box bg={"primary"} w={"100%"} borderRadius={"0.5em"} p={"0.5em"}>
          <Input onChange={(e) => setFileImage(e.target.files !== null ? e.target.files : undefined)} type='file' w={"min-content"} maxW={"100%"} h={"min-content"} p={0} m={0} name={`${name}`} id={`${id}`} borderRadius={"0.5em"} ref={imageRef}/>
        </Box>
        
      </VStack>}
      {/* Multiple Choice */}
      {variant == 5 && <HStack>
        {choiceArray && choiceArray.map((item) => {
          return (
            <Button bg={selectedChoice == item.value ? "primary" : "lightgray"} onClick={() => {onSelectChoice(item)}}>{item.label}</Button>
          )
        })}
      </HStack>}
    </Box>
  )
}

export default InputForm