import { Button, useToast, VStack } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import Title from '../components/Title'
import { useEffect, useState } from 'react'
import InputContainer from '../components/InputContainer'
import InputFormV2 from '../components/InputFormV2'
import { fetchFromDynamoDB, uploadToDynamoDB } from '../api/general.api'
import { useQuery } from '@tanstack/react-query'
import PageLoader from '../components/PageLoader'
import { ContactList, ContactPageData } from '../types/types'



const EditContactPage = () => {

  const toast = useToast()

  const [contactPage, setContactPage] = useState<ContactPageData>({
    page: "contact",
    email: "",
    instagram: "",
    linkedin: "",
    location: "",
    number: "",
    pinterest: "",
    twitter: "",
    facebook: "",
    tiktok: ""
  })

  const updateContactInput = (section: keyof ContactList, value: string) => {
    const obj = {...contactPage}
    obj[section] = value
    setContactPage(obj)
  }

  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["fetchContactData"], queryFn: () => fetchFromDynamoDB("/contact"), enabled: true})
  const {isFetching: uploadLoading, isError: uploadError, refetch: handleUpdate, isSuccess: uploadSuccess, isFetchedAfterMount, failureReason} = useQuery({queryKey: ["uploadOurStoryData"], queryFn: () => uploadToDynamoDB<ContactPageData>({...contactPage, page: "contact"}, "/contact"), enabled: false})

  useEffect(() => {
      if (pageData?.Items){
        setContactPage(pageData.Items[0])
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
    <VStack bg={"primary"} w={"100vw"} justify={"start"} >
      <Navbar variant={3} to='/hub' title='Back To Hub'/>
      <Title title={`Edit Contact Page & Info`}/>
      <Button onClick={() => handleUpdate()} isDisabled={uploadLoading || pageLoading} isLoading={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Save Changes
      </Button>
      <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
      <VStack w={"100%"} gap={5}>
        <InputContainer title="Contact Info" w='60%' p='0.5em 1em 1em 1em'>
          <InputFormV2 variant={1} label='Phone Number' id='n/a' name='n/a' value={contactPage?.number ?? ""} setValue={(value: string) => updateContactInput("number", value)}/>
          <InputFormV2 variant={1} label='Location' id='n/a' name='n/a' value={contactPage?.location ?? ""} setValue={(value: string) => updateContactInput("location", value)}/>
          <InputFormV2 variant={1} label='Email' id='n/a' name='n/a' value={contactPage?.email ?? ""} setValue={(value: string) => updateContactInput("email", value)}/>
          <InputFormV2 variant={1} label='Twitter Link' id='n/a' name='n/a' value={contactPage?.twitter ?? ""} setValue={(value: string) => updateContactInput("twitter", value)}/>
          <InputFormV2 variant={1} label='Instagram Link' id='n/a' name='n/a' value={contactPage?.instagram ?? ""} setValue={(value: string) => updateContactInput("instagram", value)}/>
          <InputFormV2 variant={1} label='LinkedIn Link' id='n/a' name='n/a' value={contactPage?.linkedin ?? ""} setValue={(value: string) => updateContactInput("linkedin", value)}/>
          <InputFormV2 variant={1} label='Pinterest Link' id='n/a' name='n/a' value={contactPage?.pinterest ?? ""} setValue={(value: string) => updateContactInput("pinterest", value)}/>
          <InputFormV2 variant={1} label='Facebook Link' id='n/a' name='n/a' value={contactPage?.facebook ?? ""} setValue={(value: string) => updateContactInput("facebook", value)}/>
          <InputFormV2 variant={1} label='Tiktok Link' id='n/a' name='n/a' value={contactPage?.tiktok ?? ""} setValue={(value: string) => updateContactInput("tiktok", value)}/>
        </InputContainer>
      </VStack>
    </VStack>
  )
}

export default EditContactPage
