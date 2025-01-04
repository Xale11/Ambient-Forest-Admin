import { Button, Spinner, Text, VStack } from '@chakra-ui/react'
import React from 'react'

interface Props {
  pageError: boolean
  pageLoading: boolean
  pageRefetch: () => void
}

const PageLoader = ({pageError, pageLoading, pageRefetch}: Props) => {
  if (pageError){
    return (
      <VStack>
        <Text>There was error trying fetch the data. Press the button below to try again.</Text>
        <Button onClick={() => pageRefetch()} isDisabled={pageLoading} isLoading={pageLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
          Try Again
        </Button>
      </VStack>
    )
  }
  if (!pageError && pageLoading){
    return (
      <VStack>
        <Text>Loading Data...</Text>
        <Spinner/>
      </VStack>
    )
  }
  
}

export default PageLoader
