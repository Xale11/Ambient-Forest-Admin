import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Title from '../components/Title'
import { TermsCondition, TermsPageData } from '../types/types'
import InputFormV2 from '../components/InputFormV2'
import { fetchFromDynamoDB, uploadToDynamoDB } from '../api/general.api'
import { useQuery } from '@tanstack/react-query'
import PageLoader from '../components/PageLoader'
import AreYouSureBtn from '../components/AreYouSureBtn'

const EditTermsPage = () => {

  const toast = useToast()

  const [terms, setTerms] = useState<TermsCondition[]>([])

  const addNewTerm = () => {
    setTerms([...terms, {
      title: "New Term Name",
      content: "State The Terms",
    }])
  }

  const deleteTerm = (index: number) => {
    const newArr = [...terms].filter((_, i) => i != index)
    setTerms(newArr)
  }

  const updateTerms = (i: number, section: string, value: string) => {
    const arr = [...terms]
    arr[i][section as "title" | "content"] = value
    setTerms(arr)
  }

  // tan stack
  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["fetchTermsData"], queryFn: () => fetchFromDynamoDB("/terms"), enabled: true})
  const {isFetching: uploadLoading, isError: uploadError, refetch: handleUpdate, isSuccess: uploadSuccess, isFetchedAfterMount, failureReason} = useQuery({queryKey: ["uploadTermsData"], queryFn: () => uploadToDynamoDB<TermsPageData>({page: "terms", terms: terms}, "/terms"), enabled: false})

  useEffect(() => {
        if (pageData?.Items){
          setTerms(pageData.Items[0]?.terms ?? [])
        }
      }, [pageData])
    
      useEffect(() => {
        if (!uploadLoading && uploadSuccess){
          toast({
            status: "success",
            title: "Upload Successful",
            position: "top",
            duration: 3000,
            isClosable: true
          })
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

  return (
    <VStack bg={"primary"} w={"100vw"} minH={"100vh"} justify={"start"} pb={5}>
      <Navbar variant={3} to='/hub' title='Back To Hub'/>
      <Title title={`Edit Terms Page`}/>
      <Button onClick={() => handleUpdate()} isDisabled={uploadLoading || pageLoading} isLoading={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Save Changes
      </Button>
      <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
      <VStack w={"100%"} gap={5}>
        <Accordion w={"95%"} bg="white" borderRadius={"1em"} allowToggle>
          {terms.map((term, i) => {
            return (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      {term.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <InputFormV2 variant={1} label='Terms Title' id='n/a' name='n/a' value={term.title} setValue={(value: string) => updateTerms(i, "title", value)}/>
                  <InputFormV2 variant={2} label='Terms Content' id='n/a' name='n/a' value={term.content} setValue={(value: string) => updateTerms(i, "content", value)}/>
                  <AreYouSureBtn label="Delete Term" modalMessage="Are you sure want to delete this article section? Make sure to press the save changes button after!" onClick={() => deleteTerm(i)}/>
                </AccordionPanel>
              </AccordionItem>
            )
          })}
        </Accordion>
      </VStack>
      <Button isDisabled={uploadLoading || pageLoading} onClick={addNewTerm} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Add New Terms
      </Button>
    </VStack>
  )
}

export default EditTermsPage

