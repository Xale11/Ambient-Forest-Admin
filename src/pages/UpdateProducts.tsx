import { Button, ButtonGroup, FormLabel, HStack, Switch, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Title from '../components/Title'
import InputContainer from '../components/InputContainer'
import InputForm from '../components/InputForm'
import FileInput from '../components/FileInput'
import { AdditionalImage, Product } from '../types/types'
import { deleteProductFromDynamoDB, getProductByTypeAndIdFromDynamoDB, updateProduct } from '../api/shop.api'
import { isValidEditProduct} from '../util/productHandling'
import { productTypeList, seasonList } from '../data/ProductData'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import EditadditionalImages from '../components/EditadditionalImages'
import PageLoader from '../components/PageLoader'
import AreYouSureBtn from '../components/AreYouSureBtn'
import { deleteS3Folder } from '../api/general.api'
import InputFormV2 from '../components/InputFormV2'
import { makeFirstLetterUpper } from '../util/stringHandling'
import { useNavigate } from 'react-router-dom'

const UpdateProducts = () => {

  const toast = useToast()

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get("type") ?? ""
  const id = searchParams.get("id") ?? ""

  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState<string>("000")
  const [keyContent, setKeyContent] = useState<string>("")
  const [productType, setProductType] = useState<string>("")
  const [season, setSeason] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const [clp, setClp] = useState<string>("")
  const [primaryImg, setPrimaryImg] = useState<FileList|undefined>(undefined)
  const [primaryImgUrl, setPrimaryImgUrl] = useState<string>("")
  const [secondaryImg, setSecondaryImg] = useState<FileList|undefined>(undefined)
  const [secondaryImgUrl, setSecondaryImgUrl] = useState<string>("")
  const [additionalImgs, setAdditionalImgs] = useState<AdditionalImage[]>([])
  const [topNotes, setTopNotes] = useState<string>("")
  const [topNotesColor, setTopNotesColor] = useState<string>("")
  const [heartNotes, setHeartNotes] = useState<string>("")
  const [heartNotesColor, setHeartNotesColor] = useState<string>("")
  const [baseNotes, setBaseNotes] = useState<string>("")
  const [baseNotesColor, setBaseNotesColor] = useState<string>("")
  const [showNotes, setShowNotes] = useState<boolean>(false) // toggles whether notes for candles show
  const [createdAt, setCreatedAt] = useState<string>("")
  const [productId, setProductId] = useState<string>("")
  const [isSoldOut, setIsSoldOut] = useState<boolean>(false)
  const [hideProduct, setHideProduct] = useState<boolean>(false)


  // handles update of product
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateProduct = async () => {

    const newProduct: Product = {
      productType: productType as "candle" | "tealight" | "giftset",
      productId: productId,
      season: season as "spring" | "summer" | "autumn" | "winter",
      name: name,
      keyContent: keyContent,
      price: price.replace(".", ''),
      description: desc,
      mainImageUrl: primaryImgUrl,
      mainImageFile: primaryImg ? primaryImg[0] : undefined,
      secondaryImageUrl: secondaryImgUrl,
      secondaryImageFile: secondaryImg ? secondaryImg[0] : undefined,
      notes: {
        topNotes: {
          color: topNotesColor,
          content: topNotes
        },
        heartNotes: {
          color: heartNotesColor,
          content: heartNotes
        },
        baseNotes: {
          color: baseNotesColor,
          content: baseNotes
        }
      },
      createdAt: createdAt,
      additionalImages: additionalImgs,
      clp: clp,
      hideProduct: hideProduct,
      isSoldOut: isSoldOut
    }


    const isValid = isValidEditProduct(newProduct)
    console.log(isValid, newProduct)

    if (isValid.valid){
      const res = await updateProduct(newProduct)
      return res
    } else {
      return isValid.message
    }
    
  }

  const deleteProduct = async () => {
    const dbRes = await deleteProductFromDynamoDB(productType, productId)
    const s3Res = await deleteS3Folder(productId)
    return [dbRes, s3Res]
  }

  // tanstack queries
  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["updateNewProduct"], queryFn: () => getProductByTypeAndIdFromDynamoDB(type, id)})
  const {isFetching: uploadLoading, isError: uploadError, refetch: handleUpdate, isSuccess: uploadSuccess, isFetchedAfterMount, failureReason} = useQuery({queryKey: ["updateProduct"], queryFn: () => handleUpdateProduct(), enabled: false})
  const {isFetching: deleteLoading, isError: deleteError, refetch: deleteRefetch, isSuccess: deleteSuccess, isFetchedAfterMount: deletedAfterMount} = useQuery({queryKey: ["deleteProduct"], queryFn: () => deleteProduct(), enabled: false})

  useEffect(() => {
    if (!uploadLoading && uploadSuccess && isFetchedAfterMount){
      toast({
        status: "success",
        title: "Upload Successful",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      pageRefetch()
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
    if (!deleteLoading && deleteSuccess && deletedAfterMount){
      toast({
        status: "success",
        title: "Delete Successful",
        position: "top",
        duration: 3000,
        isClosable: true
      })
      setTimeout(() => navigate("/products"), 1000)
    }

    if (!deleteLoading && deleteError && deletedAfterMount){
      toast({
        status: "error",
        title: "An error occured deleteing the image. Please try again.",
        description: failureReason?.message,
        position: "top",
        duration: 3000,
        isClosable: true
      })
    }
  }, [deleteLoading])

  useEffect(() => {
    if (productType == "candle" || productType == "tealight"){
      setShowNotes(true)
    } else {
      setShowNotes(false)
    }
  }, [productType])

  useEffect(() => {
    setProductId(pageData?.Item?.productId ?? "")
    setName(pageData?.Item?.name ?? "")
    setPrice((parseInt(pageData?.Item?.price) / 100).toString() ?? "")
    setKeyContent(pageData?.Item?.keyContent ?? "")
    setProductType(pageData?.Item?.productType ?? "")
    setSeason(pageData?.Item?.season ?? "")
    setDesc(pageData?.Item?.description ?? "")
    setClp(pageData?.Item?.clp ?? "")
    setTopNotes(pageData?.Item?.notes?.topNotes?.content ?? "")
    setTopNotesColor(pageData?.Item?.notes?.topNotes?.color ?? "")
    setHeartNotes(pageData?.Item?.notes?.heartNotes?.content ?? "")
    setHeartNotesColor(pageData?.Item?.notes?.heartNotes?.color ?? "")
    setBaseNotes(pageData?.Item?.notes?.baseNotes?.content ?? "")
    setBaseNotesColor(pageData?.Item?.notes?.baseNotes?.color ?? "")
    setPrimaryImgUrl(pageData?.Item?.mainImageUrl ?? "")
    setSecondaryImgUrl(pageData?.Item?.secondaryImageUrl ?? "")
    setAdditionalImgs(pageData?.Item?.additionalImages ?? [])
    setCreatedAt(pageData?.Item?.createdAt ?? "")

  }, [pageData])

  console.log(additionalImgs)

  return (
    <VStack bg={"primary"} w={"100vw"} justify={"start"} paddingBottom={"2em"}>
      <Navbar variant={3} to='/products' title='Back To Products List'/>
      <Title title={`Update Product`}/>
      <ButtonGroup>
        <Button  onClick={() => handleUpdate()} isDisabled={uploadLoading || pageLoading} isLoading={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
          Update Product
        </Button>
        <AreYouSureBtn onClick={() => deleteRefetch()} label='Delete Product' modalMessage='Are you sure you want to delete this product? It cannot be undone!' mt='0' isDisabled={uploadLoading || pageLoading} isLoading={uploadLoading} />
      </ButtonGroup>
      
      <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
      <VStack w={"100%"} pt={"1em"}>
        <InputContainer title="General Information" w='60%' p='0.5em 1em 1em 1em'>
          <InputForm variant={1} label='Name*' id='productName' name='productName' value={name} setValue={setName}/>
          <InputForm variant={5} label='Season*' id='season' name="season" value={season} setValue={setSeason} choiceArray={seasonList} presetChoice={season}></InputForm>
          <InputFormV2 variant={1} label='Product Type - (Cannot Be Changed)' id='productType' name="productType" value={makeFirstLetterUpper(productType)} setValue={(value: string) => value} choiceArray={productTypeList} ></InputFormV2>
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
            <FileInput variant={1} label='Primary Image*' id='primaryImage' name='primaryImage' value={primaryImg} w='47%' setValue={setPrimaryImg} presetUrl={`${primaryImgUrl}?t=${Date.now()}`}/>
            <FileInput variant={1} label='Secondary Image' id='secondaryImage' name='secondaryImage' value={secondaryImg} w='47%' setValue={setSecondaryImg} presetUrl={`${secondaryImgUrl}?t=${Date.now()}`}/>
          </HStack>
          
          <EditadditionalImages label='Additional Images' value={additionalImgs} w='100%' setValue={setAdditionalImgs} saveFunction={() => handleUpdate()}/>
        </InputContainer>
      </VStack>
    </VStack>
  )
}

export default UpdateProducts
