import { Flex, HStack, Image, Text, VStack } from "@chakra-ui/react"
import { Product } from "../types/types"
import LinkButton from "./LinkButton"

interface Props {
  product: Product
  hideEdit?: boolean
}

export const ProductCard = ({ product, hideEdit }: Props) => {

  const baseImgUrl = import.meta.env.VITE_USE_CLOUDFRONT === "true" ? import.meta.env.VITE_CLOUDFRONT_URL : import.meta.env.VITE_S3_URL

  return (
    <HStack bg={"white"} borderRadius={"1em"} p={5} align={"start"}>
      <Flex bg={"primary"} h={"10em"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
        <Image src={`${baseImgUrl}/${product?.mainImageUrl}?t=${Date.now()}`} w={"100%"} aspectRatio={"1 / 1"} objectFit={"contain"} alt='Image of the product'/>
      </Flex>
      <VStack align={"start"} ml={5}>
        <Text>Name: {product.name}</Text>
        <Text>Price: £{parseInt(product.price) / 100}</Text>
        <Text>Season: {product.season.toUpperCase()}</Text>
        {!hideEdit && <LinkButton variant={2} to={`/products/form/update?type=${product?.productType}&id=${product?.productId}`} title="Edit Product"/>}
      </VStack>
    </HStack>
  )
}

export default ProductCard
