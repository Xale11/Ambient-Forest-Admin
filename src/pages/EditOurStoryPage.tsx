import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, FormLabel, HStack, useToast, VStack } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import InputContainer from "../components/InputContainer"
import InputForm from "../components/InputForm"
import { useEffect, useState } from "react"
import FileInput from "../components/FileInput"
import { OurStoryArticle } from "../types/types"
import InputFormV2 from "../components/InputFormV2"
import { v4 as uuidv4 } from "uuid"
import AreYouSureBtn from "../components/AreYouSureBtn"
import { convertFileToFileList } from "../util/fileHandling"
import { useQuery } from "@tanstack/react-query"
import { deleteFromS3, fetchFromDynamoDB } from "../api/general.api"
import { uploadOurStoryPage } from "../api/ourStory.api."
import PageLoader from "../components/PageLoader"

const EditOurStoryPage = () => {

  const toast = useToast()

  const [articles, setArticles] = useState<OurStoryArticle[]>([])
  const [pageDescription, setPageDescription] = useState<string>("")
  const [objectKey, setObjectKey] = useState<string>("")

  const addNewArticle = () => {
    const uuid = uuidv4()
    setArticles([...articles, {
      title: "Article Title",
      articleId: uuid,
      message: "Article Message",
      imageUrl: "",
      imageFile: undefined
    }])
  }

  const deleteArticle = (index: number) => {
    const newArr = [...articles].filter((_, i) => i != index)
    setArticles(newArr)
  }

  const updateArticles = (i: number, section: string, value: string) => {
    const arr = [...articles]
    arr[i][section as "title" | "message"] = value
    setArticles(arr)
  }

  const updateArticleFile = (i: number, value: FileList | undefined) => {
    const arr = [...articles]
    arr[i].imageFile = value ? value[0] : undefined
    setArticles(arr)
  }

  const deleteArticleImage = async (i: number) => {
    const key = articles[i].imageUrl
    articles[i].imageUrl = ""
    setObjectKey(key)
    await handleUpdate()
    await deleteRefetch()
  }

  // tan stack
  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["fetchOurStoryData"], queryFn: () => fetchFromDynamoDB("/ourStory"), enabled: true})
  const {isFetching: uploadLoading, isError: uploadError, refetch: handleUpdate, isSuccess: uploadSuccess, isFetchedAfterMount, failureReason} = useQuery({queryKey: ["uploadOurStoryData"], queryFn: () => uploadOurStoryPage({page: "ourStory",articles: articles, pageDescription: pageDescription}), enabled: false})
  const {data: deleteData, isFetching: deleteLoading, isError: deleteError, refetch: deleteRefetch, isSuccess: deleteSuccess, isFetchedAfterMount: deletedAfterMount} = useQuery({queryKey: ["deleteS3image"], queryFn: () => deleteFromS3(objectKey), enabled: false})

  useEffect(() => {
    if (pageData?.Items){
      setArticles(pageData.Items[0]?.articles ?? [])
      setPageDescription(pageData.Items[0]?.pageDescription ?? "")
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

  useEffect(() => {
    if (!deleteLoading && deleteSuccess && deletedAfterMount){
      toast({
        status: "success",
        title: "Delete Successful",
        position: "top",
        duration: 3000,
        isClosable: true
      })
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

  console.log(articles, deleteData)

  return (
    <VStack bg={"primary"} w={"100vw"} minH={"100vh"} justify={"start"} >
      <Navbar variant={3} to='/hub' title='Back To Hub'/>
      <Button onClick={() => handleUpdate()} isDisabled={uploadLoading || pageLoading} isLoading={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Save Changes
      </Button>
      <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
      <VStack w={"100%"}>
        <InputContainer title="Our Story Page Data" w='95%' p='0.5em 1em 1em 1em'>
          <InputForm variant={2} label='Page Description*' id='pageDescription' name='pageDescription' value={pageDescription} setValue={setPageDescription}/>
          <FormLabel w={"95%"} >Article Sections</FormLabel>
          <Accordion w={"95%"} bg="white" borderRadius={"1em"} allowToggle>
            {articles.map((article, i) => {
              return (
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as='span' flex='1' textAlign='left'>
                        {article.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <InputFormV2 variant={1} label='Article Title' id='n/a' name='n/a' value={article.title} setValue={(value: string) => updateArticles(i, "title", value)}/>
                    <HStack>
                      <InputFormV2 variant={2} label='Article Content' id='n/a' name='n/a' value={article.message} setValue={(value: string) => updateArticles(i, "message", value)} w="80%"/>
                      <FileInput edit={true} editFunction={() => {deleteArticleImage(i)}} variant={1} label='Article Image*' id='articleImage' name='articleImage' value={convertFileToFileList(article.imageFile)} w='17.5%' mt={5} setValue={(value: FileList | undefined) => updateArticleFile(i, value)} presetUrl={article.imageUrl}/>
                    </HStack>
                    
                    <AreYouSureBtn label="Delete Article" modalMessage="Are you sure want to delete this article section? Make sure to press the save changes button after!" onClick={() => deleteArticle(i)}/>

                  </AccordionPanel>
                </AccordionItem>
              )
            })}
          </Accordion>
        </InputContainer>
      </VStack>
      <Button onClick={addNewArticle} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Add Article Section
      </Button>
    </VStack>
  )
}

export default EditOurStoryPage
