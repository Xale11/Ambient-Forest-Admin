import { Button, HStack, Text, VStack } from "@chakra-ui/react"
import { Product } from "../types/types"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getProductsByTypeFromDynamoDB } from "../api/shop.api"
import PageLoader from "./PageLoader"

interface Props {
  setValue: (value: Product | undefined) => void
  onClose: () => void
  productType: string
  season: "spring" | "summer" | "autumn" | "winter"
}

const ProductBannerModal = ({ onClose, setValue, productType, season }: Props) => {

  const [products, setProducts] = useState<Product[]>([])

  const {data: pageData, isFetching: pageLoading, isError: pageError, refetch: pageRefetch} = useQuery({queryKey: ["getProductsByTypeForBanner"], queryFn: () => getProductsByTypeFromDynamoDB(productType)})

  const selectProduct = (product: Product | undefined) => {
    setValue(product)
    onClose()
  }
  
  useEffect(() => {
    if (pageData?.Items){
      setProducts(pageData.Items.filter((item: Product) => item.season == season))
    }
  }, [pageData])

  return (
    <VStack w={"100%"}>
      <Button isDisabled={pageLoading} mt={5} onClick={() => selectProduct(undefined)} bg="black1" color={"white"}>Remove Banner Product</Button>
      <HStack w={"100%"} wrap={"wrap"} justify={"center"}>
        <PageLoader pageError={pageError} pageLoading={pageLoading} pageRefetch={pageRefetch}/>
        {!pageLoading && products.length == 0 && <Text my={5}>There are now products of type {productType} in the season of {season} </Text>}
        {products.map((product) => {
          return (
            <VStack gap={0} my={2} py={2} border={"1px solid black"} borderRadius={"1em"}>
              <ProductCard product={product} hideEdit={true}/>
              <Button onClick={() => selectProduct(product)} bg="black1" color={"white"}>Set as banner product</Button>
            </VStack>
          )
        })}
      </HStack>
    </VStack>
    
  )
}

export default ProductBannerModal
