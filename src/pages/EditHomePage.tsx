import { Button, HStack, useToast, VStack } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import InputContainer from '../components/InputContainer'
import { useEffect, useState } from 'react'
import Title from '../components/Title'
import ProductBannerSelector from '../components/ProductBannerSelector'
import { BannnerMessages, Product, ProductBanner } from '../types/types'
import InputFormV2 from '../components/InputFormV2'
import { useQuery } from '@tanstack/react-query'
import { fetchFromDynamoDB} from '../api/general.api'
import PageLoader from '../components/PageLoader'
import FileInput from '../components/FileInput'
import { uploadHomePage } from '../api/home.api'

const EditHomePage = () => {

  const toast = useToast()

  const [primaryImg, setPrimaryImg] = useState<FileList | undefined>()
  const [primaryImgUrl, setPrimaryImgUrl] = useState<string>("")
  const [bannerMessages, setBannerMessages] = useState<BannnerMessages>({ msg1: "", msg2: "", msg3: "", msg4: ""})
  const [productBanner, setProductBanner] = useState<ProductBanner>({
    candle: undefined,
    giftset: undefined,
    tealight: undefined
  })

  const generateBannerArray = () => {
    const arr: {type: "candle" | "tealight" | "giftset"}[] = [
      {
        type: "candle",
      },
      {
        type: "tealight",
      },
      {
        type: "giftset",
      },
    ]

    return arr
  }

  const selectProduct = (product: Product | undefined, type: "candle" | "tealight" | "giftset") => {
    const newBanner = {...productBanner}
    newBanner[type] = product
    setProductBanner(newBanner)
  }

  const setBannerMsg = (msg: string, msgNum: keyof BannnerMessages) => {
    const newBannerMsgs = {...bannerMessages}
    newBannerMsgs[msgNum] = msg
    setBannerMessages(newBannerMsgs)

  }

  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["fetchHomePageData"], queryFn: () => fetchFromDynamoDB("/home"), enabled: true})
  const {isFetching: uploadLoading, isError: uploadError, refetch: handleUpdate, isSuccess: uploadSuccess, isFetchedAfterMount, failureReason} = useQuery({queryKey: ["uploadHomePageData"], queryFn: () => uploadHomePage({page: 'home', mainImgUrl: primaryImgUrl, mainImgFile: primaryImg?.[0] ?? undefined, bannerMessages: bannerMessages, productBanner: productBanner}), enabled: false})

  useEffect(() => {
      if (pageData?.Items){
        if (pageData.Items[0]?.bannerMessages){
          setBannerMessages(pageData.Items[0]?.bannerMessages)
        }
        if (pageData.Items[0]?.productBanner){
          setProductBanner(pageData.Items[0].productBanner)
        }
        if (pageData.Items[0]?.mainImgUrl){
          setPrimaryImgUrl(pageData.Items[0].mainImgUrl)
        }
      }
    }, [pageData])
  
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

  console.log(pageData, productBanner)

  return (
    <VStack bg={"primary"} w={"100vw"} justify={"start"} >
      <Navbar variant={3} to='/hub' title='Back To Hub'/>
      <Title title={`Edit Home Page`}/>
      <Button onClick={() => handleUpdate()} isDisabled={uploadLoading} isLoading={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Save Changes
      </Button>
      <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
      <VStack w={"100%"} gap={5}>
        <InputContainer title="Home Page Background Image" w='60%' p='0.5em 1em 1em 1em'>
          <FileInput edit={true} variant={1} label='Primary Image*' id='primaryImage' name='primaryImage' value={primaryImg} w='47%' setValue={setPrimaryImg} presetUrl={`${primaryImgUrl}?t=${Date.now()}`}/>
          <Button mt={3} onClick={() => setPrimaryImg(undefined)} bg={"black1"} color={"white"} w={"45%"} textAlign={"center"} fontSize={"sm"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
            Revert Changes
          </Button>
        </InputContainer>
        <InputContainer title="Home Banner Messages" w='60%' p='0.5em 1em 1em 1em'>
          <InputFormV2 variant={2} label='Home Banner Message 1' id='homeBannerMsg1' name='homeBannerMsg1' value={bannerMessages.msg1} setValue={(value: string) => setBannerMsg(value, 'msg1')}/>
          <InputFormV2 variant={2} label='Home Banner Message 2' id='homeBannerMsg2' name='homeBannerMsg2' value={bannerMessages.msg2} setValue={(value: string) => setBannerMsg(value, 'msg2')}/>
          <InputFormV2 variant={2} label='Home Banner Message 3' id='homeBannerMsg3' name='homeBannerMsg3' value={bannerMessages.msg3} setValue={(value: string) => setBannerMsg(value, 'msg3')}/>
          <InputFormV2 variant={2} label='Home Banner Message 4' id='homeBannerMsg4' name='homeBannerMsg4' value={bannerMessages.msg4} setValue={(value: string) => setBannerMsg(value, 'msg4')}/>
        </InputContainer>
        <InputContainer title="Product Banner" w='60%' p='0.5em 1em 1em 1em'>
          <HStack w={"100%"} justify={"center"}>
            {generateBannerArray().map((item) => {
              return (
                <ProductBannerSelector w='23.5%' product={productBanner[item.type]} setValue={(value: Product | undefined) => selectProduct(value, item.type)} productType={item.type}/>
              )
            })}
          </HStack>
        </InputContainer>
      </VStack>
    </VStack>
  )
}

export default EditHomePage
