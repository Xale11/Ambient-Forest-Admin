import { Button, FormLabel, HStack, Modal, ModalContent, ModalOverlay, Switch, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Title from '../components/Title'
import InputContainer from '../components/InputContainer'
import InputForm from '../components/InputForm'
import FileInput from '../components/FileInput'
import { Product } from '../types/types'
import { v4 as uuidv4 } from 'uuid';
import { uploadProduct } from '../api/shop.api'
import { isValidProduct } from '../util/productHandling'
import { productTypeList, seasonList } from '../data/ProductData'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AutoFillModal from '../components/AutoFillModal'

const UploadProducts = () => {

  const navigate = useNavigate()
  const toast = useToast()

  const { isOpen, onClose, onOpen} = useDisclosure()

  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<string>("000")
  // const [color, setColor] = useState<string>("")
  const [keyContent, setKeyContent] = useState<string>("")
  const [productType, setProductType] = useState<string>("")
  const [season, setSeason] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const [clp, setClp] = useState<string>("")
  const [primaryImg, setPrimaryImg] = useState<FileList|undefined>(undefined)
  const [secondaryImg, setSecondaryImg] = useState<FileList|undefined>(undefined)
  const [additionalImgs, setAdditionalImgs] = useState<FileList|undefined>(undefined)
  const [topNotes, setTopNotes] = useState<string>("")
  const [topNotesColor, setTopNotesColor] = useState<string>("")
  const [heartNotes, setHeartNotes] = useState<string>("")
  const [heartNotesColor, setHeartNotesColor] = useState<string>("")
  const [baseNotes, setBaseNotes] = useState<string>("")
  const [baseNotesColor, setBaseNotesColor] = useState<string>("")
  const [showNotes, setShowNotes] = useState<boolean>(false) // toggles whether notes for candles show
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false)
  const [hideProduct, setHideProduct] = useState<boolean>(false)

  const [product, setProduct] = useState<Product>()

  // handles uploading new product
  const handleUpload = async () => {
    
    // generate a unique id for the product
    const uuid = uuidv4()


    const newProduct: Product = {
      productType: productType as "candle" | "tealight" | "giftset",
      productId: uuid,
      season: season as "spring" | "summer" | "autumn" | "winter",
      name: name,
      keyContent: keyContent,
      price: price.replace(".", ''),
      description: desc,
      mainImageUrl: "",
      mainImageFile: primaryImg ? primaryImg[0] : undefined,
      secondaryImageUrl: "",
      secondaryImageFile: secondaryImg ? secondaryImg[0] : undefined,
      notes: {
        topNotes: {
          color: productType === "giftset" ? "" : topNotesColor,
          content: productType === "giftset" ? "" : topNotes
        },
        heartNotes: {
          color: productType === "giftset" ? "" : heartNotesColor,
          content: productType === "giftset" ? "" : heartNotes
        },
        baseNotes: {
          color: productType === "giftset" ? "" : baseNotesColor,
          content: productType === "giftset" ? "" : baseNotes
        }
      },
      createdAt: new Date().toISOString(),
      additionalImages: additionalImgs ? [...Array(additionalImgs.length)].map((_, index) => {
        return {
          imageUrl: URL.createObjectURL(additionalImgs[index]),
          additionalImageId: `${uuidv4()}`,
          additionalImageFile: additionalImgs[index]
        }
      }) : [],
      clp: clp,
      isSoldOut: isSoldOut,
      hideProduct: hideProduct
    }

    console.log(newProduct)

    const isValid = isValidProduct(newProduct)

    if (isValid.valid){
      const res = await uploadProduct(newProduct)
      return res
    } else {
      throw new Error(`${isValid.message}`)
    }
    
  }

  // tanstack queries
  const {isFetching: uploadLoading, isError: uploadError, refetch: handleUpdate, isSuccess: uploadSuccess, isFetchedAfterMount, failureReason} = useQuery({queryKey: ["uploadNewProduct"], queryFn: handleUpload, enabled: false})

  useEffect(() => {
    if (productType == "candle" || productType == "tealight"){
      setShowNotes(true)
    } else {
      setShowNotes(false)
    }
  }, [productType])

  useEffect(() => {
    if (!uploadLoading && uploadSuccess && isFetchedAfterMount){
      toast({
        status: "success",
        title: "Upload Successful",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      setTimeout(() => navigate("/products"), 1000)
    }

    if (!uploadLoading && uploadError && isFetchedAfterMount){
      toast({
        status: "error",
        title: "An error occured uploading the data. Please try again.",
        description: failureReason?.message,
        position: "top",
        duration: 3000,
        isClosable: true
      })
    }
  }, [uploadLoading])

  useEffect(() => {
    setName(product?.name ?? "")
    setKeyContent(product?.keyContent ?? "")
    setSeason(product?.season ?? "")
    setDesc(product?.description ?? "")
    setClp(product?.clp ?? "")
    setTopNotes(product?.notes?.topNotes?.content ?? "")
    setTopNotesColor(product?.notes?.topNotes?.color ?? "")
    setHeartNotes(product?.notes?.heartNotes?.content ?? "")
    setHeartNotesColor(product?.notes?.heartNotes?.color ?? "")
    setBaseNotes(product?.notes?.baseNotes?.content ?? "")
    setBaseNotesColor(product?.notes?.baseNotes?.color ?? "")

  }, [product])


  return (
    <VStack bg={"primary"} w={"100vw"} justify={"start"} paddingBottom={"2em"}>
      <Navbar variant={3} to='/products' title='Back To Products List'/>
      <Title title={`Add Product`}/>
      <Button onClick={() => {handleUpdate();}} isDisabled={uploadLoading} isLoading={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Upload New Product
      </Button>
      <Button onClick={() => {onOpen();}} isDisabled={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Autofill
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay/>
        <ModalContent >
          <AutoFillModal onClose={onClose} setValue={setProduct} productType={"candle"}/>
        </ModalContent>
      </Modal>
      <VStack w={"100%"} pt={"1em"}>
        <InputContainer title="General Information" w='60%' p='0.5em 1em 1em 1em'>
          <InputForm variant={1} label='Name*' id='productName' name='productName' value={name} setValue={setName}/>
          <InputForm variant={5} label='Season*' id='season' name="season" value={season} setValue={setSeason} choiceArray={seasonList} presetChoice={season}></InputForm>
          <InputForm variant={5} label='Product Type*' id='productType' name="productType" value={productType} setValue={setProductType} choiceArray={productTypeList}></InputForm>
          {/* <InputForm variant={1} label='Color' id='color' name='color' value={color} setValue={setColor}/> */}
          <InputForm variant={1} label='Key Content*' id='keyContent' name='keyContent' value={keyContent} setValue={setKeyContent} placeholder="e.g. Cinnamon, nutmeg & clove"/>
          <InputForm variant={3} label='Price*' id='price' name='price' value={price} setValue={setPrice}/>
          <InputForm variant={2} label='Desc*' id='desc' name='desc' value={desc} setValue={setDesc}/>
          <InputForm variant={1} label='Clp*' id='clp' name='clp' value={clp} setValue={setClp}/>
          <VStack w={"95%"} align={"start"}>
            <FormLabel>Sold Out</FormLabel>
            <Switch isChecked={isSoldOut} onChange={(e) => setIsSoldOut(e.target.checked)}/>
          </VStack>
          <VStack w={"95%"} align={"start"}>
            <FormLabel>Hide Product On Website</FormLabel>
            <Switch isChecked={hideProduct} onChange={(e) => setHideProduct(e.target.checked)}/>
          </VStack>
          {showNotes && <VStack w={"100%"}>
            <InputForm variant={1} label="Top Notes (Doesn't apply to all products)" id='clp' name='clp' value={topNotes} setValue={setTopNotes}/>
            <InputForm variant={1} label="Top Notes Color (optional)" id='clp' name='clp' placeholder='Enter a color... e.g. blue, #2c2c2c, rgb(12, 23, 44)' value={topNotesColor} setValue={setTopNotesColor}/>
            <InputForm variant={1} label="Heart Notes (Doesn't apply to all products)" id='clp' name='clp' value={heartNotes} setValue={setHeartNotes}/>
            <InputForm variant={1} label="Heart Notes Color (optional)" id='clp' name='clp' placeholder='Enter a color... e.g. blue, #2c2c2c, rgb(12, 23, 44)' value={heartNotesColor} setValue={setHeartNotesColor}/>
            <InputForm variant={1} label="Base Notes (Doesn't apply to all products)" id='clp' name='clp' value={baseNotes} setValue={setBaseNotes}/>
            <InputForm variant={1} label="Base Notes Color (optional)" id='clp' name='clp' placeholder='Enter a color... e.g. blue, #2c2c2c, rgb(12, 23, 44)' value={baseNotesColor} setValue={setBaseNotesColor}/>
          </VStack>}
        </InputContainer>
        <InputContainer title="Upload Images" w='40%' p='0.5em 1em 1em 1em'>
          <HStack w={"100%"} spacing={0} justify={"space-between"}>
            <FileInput variant={1} label='Primary Image*' id='primaryImage' name='primaryImage' value={primaryImg} w='47%' setValue={setPrimaryImg}/>
            <FileInput variant={1} label='Secondary Image' id='secondaryImage' name='secondaryImage' value={secondaryImg} w='47%' setValue={setSecondaryImg}/>
          </HStack>
          
          <FileInput variant={2} label='Additional Images' id='extraImgs' name='extraImgs' value={additionalImgs} w='100%' setValue={setAdditionalImgs}/>
        </InputContainer>
      </VStack>
    </VStack>
  )
}

export default UploadProducts