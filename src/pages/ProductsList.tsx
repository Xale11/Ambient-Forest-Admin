import { Button, ButtonGroup, HStack, VStack } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import Title from '../components/Title'
import LinkButton from '../components/LinkButton'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProductsByTypeFromDynamoDB } from '../api/shop.api'
import { Product } from '../types/types'
import ProductCard from '../components/ProductCard'

const ProductsList = () => {

  const [productType, setProductType] = useState<string>("candle")
  const [products, setProducts] = useState<Product[]>([])

  const {data, refetch} = useQuery({queryKey: ["getProductsByType"], queryFn: () => getProductsByTypeFromDynamoDB(productType)})
  
  
  useEffect(() => {
    refetch()
  }, [productType, refetch])

  useEffect(() => {
    if (data?.Items){
      setProducts(data.Items)
    }
  }, [data])

  return (
    <VStack bg={"primary"} w={"100vw"} minH={"100vh"} justify={"start"}>
      <Navbar variant={2}/>
      <Title title="Products"/>
      <LinkButton variant={2} to="/products/form/upload" title="Add New Product"/>
      <ButtonGroup mt={5} spacing={10}>
        <Button onClick={() => {setProductType("candle")}} size={"lg"} bg={"white"} border={productType == "candles" ? "3px solid black" : "none"}>Candles</Button>
        <Button onClick={() => {setProductType("tealight")}} size={"lg"} bg={"white"} border={productType == "tealights" ? "3px solid black" : "none"}>Tealights</Button>
        <Button onClick={() => {setProductType("giftset")}} size={"lg"} bg={"white"} border={productType == "giftsets" ? "3px solid black" : "none"}>Giftsets</Button>
      </ButtonGroup>
      <HStack mt={5} w={"95%"} wrap={"wrap"} justify={"center"}>
        {products.map((product) => {
          return (
            <ProductCard product={product}/>
          )
        })}
        
      </HStack>
    </VStack>
  )
}

export default ProductsList