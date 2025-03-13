import { Flex, Heading, Icon, Link, Modal, ModalContent, ModalOverlay, Spacer, Stack, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { AiOutlineShop } from 'react-icons/ai'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { IoArrowBack, IoMenu } from 'react-icons/io5'
import { useEffect } from 'react'
import LinkButton from './LinkButton'
import { useAuth } from 'react-oidc-context'
import { signOutRedirect } from '../util/authHandling'

interface Props {
  variant: number
  to?: string
  title?: string
}

const Navbar = ({variant, to, title}: Props) => {

  const auth = useAuth();
  const navigate = useNavigate()

  const {onClose, onOpen, isOpen } = useDisclosure()
 
  const logOut = async () => {
    if (auth.isAuthenticated){
      await auth.removeUser()
    }
    signOutRedirect()
  }

  useEffect(() => {
    const authReset = setTimeout(() => {
      if (!auth.isAuthenticated){
        navigate("/")
      }
    }, 600)
    
    return () => {
      clearTimeout(authReset)
    }
  }, [auth.isAuthenticated])
  
  return (
    <Stack direction={"row"} w={"100%"} p={"2em 2em"} alignItems={"space-between"} gap={"2em"}>
      <Flex w={"20%"}>
        {variant === 1 && <Link href='#' display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Icon as={AiOutlineShop} fontSize={"1.25em"}/>
          <Text textAlign={"center"}>Link To Store Page</Text>
        </Link>}
        {variant === 2 && <Link as={RouterLink} to={"/hub"} display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Icon as={IoArrowBack} fontSize={"1.25em"}/>
          <Text textAlign={"center"}>Back To Hub</Text>
        </Link>}
        {variant === 3 && <Link as={RouterLink} to={`${to}`} display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Icon as={IoArrowBack} fontSize={"1.25em"}/>
          <Text textAlign={"center"}>{title}</Text>
        </Link>}
      </Flex>
        
      <Spacer/>
      <Heading as={"h1"} size={{base: "md", lg: "xl"}} textAlign={"center"}>Ambient Forest Admin</Heading>
      <Spacer/>
      <Flex w={"20%"} gap={"2em"} justifyContent={"end"} display={{base: "none", lg: "flex"}}>
        <Link href='https://app.getform.io/login' display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Text textAlign={"center"}>Link To Contact Forms</Text>
        </Link>
        <Link href='https://stripe.com/gb' display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Text textAlign={"center"}>Link To Stripe</Text>
        </Link>
        <Link as={RouterLink} to={"/"} onClick={logOut} display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Text textAlign={"center"}>Sign Out</Text>
        </Link>
      </Flex>
      <Icon display={{base: "flex", lg: "none"}} onClick={onOpen} as={IoMenu} fontSize={"3em"}/>
      <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
        <ModalOverlay/>
        <ModalContent >
          <VStack w={"100%"} justifyContent={"end"} py={4} gap={5} bg={"primary"}>
            <LinkButton variant={1} to="https://app.getform.io/login" title="Link To Contact Forms"/>
            <LinkButton variant={1} to="https://stripe.com/gb" title="Link To Stripe"/>
            <LinkButton variant={1} to="/" title="Sign Out" onClick={logOut}/>
          </VStack>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

export default Navbar