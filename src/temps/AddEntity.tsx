import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, VStack } from "@chakra-ui/react"


const AddEntity = () => {

  const {onOpen, isOpen, onClose} = useDisclosure()

  return (
    <VStack>
      <FormControl>
        <Box border={"1px solid black"}>
          <FormLabel>Name</FormLabel>
          <Input></Input>
        </Box>
        <Box border={"1px solid black"}>
          <FormLabel>Name</FormLabel>
          <Input></Input>
        </Box>
        <Button onClick={onOpen}>Add Colors</Button>
        <Button bg={"green"}>Add</Button>
      </FormControl>
      <Modal onClose={onClose} isOpen={isOpen} size={"6xl"}>
        <ModalOverlay/>
        <ModalContent>
          <ModalCloseButton/>
          <ModalHeader>Add Entity</ModalHeader>
          <ModalBody>
            <FormControl>
              <Box border={"1px solid black"}>
                <FormLabel>Name</FormLabel>
                <Input></Input>
              </Box>
              <Box border={"1px solid black"}>
                <FormLabel>PriceAddOn</FormLabel>
                <Input></Input>
              </Box>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default AddEntity