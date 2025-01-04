import { Button, FormLabel, Image, Modal, ModalContent, ModalOverlay, Text, useDisclosure, VStack } from "@chakra-ui/react"
import { Product } from "../types/types"
import ProductBannerModal from "./ProductBannerModal"
import { makeFirstLetterUpper } from "../util/stringHandling"

interface Props {
  product: Product | undefined
  season: "spring" | "summer" | "autumn" | "winter"
  setValue: (value: Product | undefined) => void
  w?: string
  productType: string
}

const ProductBannerSelector = ({ product, setValue, w, productType, season }: Props) => {

  const baseImgUrl = import.meta.env.VITE_S3_URL

  const { isOpen, onClose, onOpen} = useDisclosure()

  return (
    <VStack w={`${w ? w : "95%"}`}>
      <FormLabel>{makeFirstLetterUpper (season)}</FormLabel>
      <VStack w={"100%"} bg={"primary"} aspectRatio={"1 / 1"} borderRadius={"0.5em"} align={"center"} justify={"center"}>
        {product ?  <Image src={`${baseImgUrl}/${product.mainImageUrl}`} w={"100%"} aspectRatio={"1 / 1"} objectFit={"contain"} alt='Image of the product'/> : <Text textAlign={"center"}>No Product Added</Text>}
        <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
          <ModalOverlay/>
          <ModalContent >
            <ProductBannerModal onClose={onClose} setValue={setValue} productType={productType} season={season}/>
          </ModalContent>
        </Modal>
      </VStack>
      <Button w={"95%"} onClick={onOpen} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"sm"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
        Change Product
      </Button>
    </VStack>
    
  )
}

export default ProductBannerSelector
