import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Title from '../components/Title'
import { CartPageData, DeliveryOption } from '../types/types'
import InputFormV2 from '../components/InputFormV2'
import { fetchFromDynamoDB, uploadToDynamoDB } from '../api/general.api'
import { useQuery } from '@tanstack/react-query'
import PageLoader from '../components/PageLoader'
import AreYouSureBtn from '../components/AreYouSureBtn'

const EditCartPage = () => {

  const toast = useToast()

  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])

  const addNewDeliveryOption = () => {
    setDeliveryOptions([...deliveryOptions, {
      name: "New Delivery Option",
      price: "1.00",
      shipMin: "2",
      shipMax: "5"
    }])
  }

  const deleteDeliveryOption = (index: number) => {
    const newArr = [...deliveryOptions].filter((_, i) => i != index)
    setDeliveryOptions(newArr)
  }

  const updateCart = (i: number, section: keyof DeliveryOption, value: string) => {
    const arr = [...deliveryOptions]
    arr[i][section] = value
    setDeliveryOptions(arr)
  }

  // tan stack
  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["fetchCartPageData"], queryFn: () => fetchFromDynamoDB("/cart"), enabled: true})
  const {isFetching: uploadLoading, isError: uploadError, refetch: handleUpdate, isSuccess: uploadSuccess, isFetchedAfterMount, failureReason} = useQuery({queryKey: ["uploadCartData"], queryFn: () => uploadToDynamoDB<CartPageData>({page: "cart", deliveryOptions: deliveryOptions}, "/cart"), enabled: false})

  useEffect(() => {
    if (pageData?.Items){
      setDeliveryOptions(pageData.Items[0].deliveryOptions ?? [])
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

  useEffect(() => {
    const checkedOptions = [...deliveryOptions]
    let setNewState = false
    for (const option of checkedOptions){
      if (parseInt(option.shipMin) > parseInt(option.shipMax)){ // add >= if needed
        setNewState = true
        option.shipMax = `${parseInt(option.shipMin) + 1}`
      }
    }
    if (setNewState) setDeliveryOptions(checkedOptions)
  }, [deliveryOptions])

  return (
    <VStack bg={"primary"} w={"100vw"} minH={"100vh"} justify={"start"} pb={5} >
      <Navbar variant={3} to='/hub' title='Back To Hub'/>
      <Title title={`Edit Cart Page and Delivery Prices`}/>
      <Button onClick={() => handleUpdate()} isDisabled={uploadLoading || pageLoading} isLoading={uploadLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Save Changes
      </Button>
      <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
      <VStack w={"100%"} gap={5}>
        <Accordion w={"95%"} bg="white" borderRadius={"1em"} allowToggle>
          {deliveryOptions.map((option, i) => {
            return (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as='span' flex='1' textAlign='left'>
                      {option.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <InputFormV2 variant={1} label='Delivery Name' id='n/a' name='n/a' value={option.name} setValue={(value: string) => updateCart(i, "name", value)}/>
                  <InputFormV2 variant={3} label='Delivery Price (£)' id='n/a' name='n/a' value={`${option.price}`} setValue={(value: string) => updateCart(i, "price", value)}/>
                  <InputFormV2 variant={3} label='Minimum Days for Delivery (Business Days)' step={1} precision={0} id='n/a' name='n/a' value={`${option.shipMin}`} setValue={(value: string) => updateCart(i, "shipMin", value)}/>
                  <InputFormV2 variant={3} label='Maximum Days for Delivery (Business Days)' step={1} precision={0} id='n/a' name='n/a' value={`${option.shipMax}`} setValue={(value: string) => updateCart(i, "shipMax", value)}/>

                  <AreYouSureBtn label="Delete Delivery Option" modalMessage="Are you sure want to delete this article section? Make sure to press the save changes button after!" onClick={() => deleteDeliveryOption(i)}/>
                </AccordionPanel>
              </AccordionItem>
            )
          })}
        </Accordion>
      </VStack>
      <Button isDisabled={uploadLoading || pageLoading} onClick={addNewDeliveryOption} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Add New Terms
      </Button>
    </VStack>
  )
}

export default EditCartPage