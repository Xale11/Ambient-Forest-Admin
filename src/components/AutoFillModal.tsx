import { Button, HStack, Text, VStack } from "@chakra-ui/react"
import { Product } from "../types/types"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getProductsByTypeFromDynamoDB } from "../api/shop.api"
import PageLoader from "./PageLoader"
import { makeFirstLetterUpper } from "../util/stringHandling"

interface Props {
  setValue: (value: Product | undefined) => void
  onClose: () => void
  productType: string
}

const AutoFillModal = ({ onClose, setValue, productType }: Props) => {

  const [products, setProducts] = useState<Product[]>([])

  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["getProductsByTypeForBanner"], queryFn: () => getProductsByTypeFromDynamoDB(productType)})

  const selectProduct = (product: Product | undefined) => {
    setValue(product)
    onClose()
  }
  
  useEffect(() => {
    if (pageData?.Items){
      setProducts(pageData.Items)
    }
  }, [pageData])

  return (
    <VStack w={"100%"}>
      <HStack w={"100%"} wrap={"wrap"} justify={"center"}>
        <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
        {!pageLoading && products.length == 0 && <Text my={5}>There are no products of type {makeFirstLetterUpper(productType) } </Text>}
        {products.map((product) => {
          return (
            <VStack gap={0} my={2} py={2} border={"1px solid black"} borderRadius={"1em"}>
              <ProductCard product={product} hideEdit={true}/>
              <Button onClick={() => selectProduct(product)} bg="black1" color={"white"}>Autofill with this candle</Button>
            </VStack>
          )
        })}
      </HStack>
    </VStack>
    
  )
}

export default AutoFillModal
