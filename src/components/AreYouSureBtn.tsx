import { Button, ButtonGroup, Modal, ModalContent, ModalOverlay, Text, useDisclosure, VStack } from '@chakra-ui/react'

interface Props {
  bg?: string
  fontSize?: string
  label: string
  modalMessage: string
  onClick: () => void
  w?: string
  mt?: string
  isDisabled?: boolean
  isLoading?: boolean
}

const AreYouSureBtn = ({label, modalMessage, onClick, fontSize, mt, isDisabled, isLoading}: Props) => {

  const {isOpen, onClose, onOpen} = useDisclosure()

  return (
    <Button mt={mt ? mt : 3} onClick={() => onOpen()} isDisabled={isDisabled} isLoading={isLoading} bg={"black1"} color={"white"} textAlign={"center"} fontSize={fontSize ? fontSize : "lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
      <Text>{label}</Text>
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay/>
        <ModalContent >
          <VStack py={5}>
            <Text>{modalMessage}</Text>
            <ButtonGroup>
              <Button mt={3} onClick={() => {onClick(); onClose()}} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
                Yes
              </Button>
              <Button mt={3} onClick={onClose} bg={"black1"} color={"white"} textAlign={"center"} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white" }}>
                No
              </Button>
            </ButtonGroup>
          </VStack>
        </ModalContent>
      </Modal>
    </Button>
  )
}

export default AreYouSureBtn
