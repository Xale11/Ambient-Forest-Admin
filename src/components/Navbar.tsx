import { Flex, Heading, Icon, Link, Spacer, Stack, Text } from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import { AiOutlineShop } from 'react-icons/ai'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/firebase'
import { IoArrowBack } from 'react-icons/io5'
import { useEffect } from 'react'

interface Props {
  variant: number
  to?: string
  title?: string
}

const Navbar = ({variant, to, title}: Props) => {

  const navigate = useNavigate()

  const logOut = async () => {
    await signOut(auth)
  }

  useEffect(() => {
    if (auth.currentUser == null){
      navigate("/")
    }
  }, [auth])
  

  return (
    <Stack direction={"row"} w={"100%"} p={"2em 2em"} alignItems={"space-between"} gap={"2em"}>
      <Flex w={"20%"}>
        {variant === 1 && <Link href='#' display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Icon as={AiOutlineShop} fontSize={"1.25em"}/>
          <Text>Link To Store Page</Text>
        </Link>}
        {variant === 2 && <Link as={RouterLink} to={"/hub"} display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Icon as={IoArrowBack} fontSize={"1.25em"}/>
          <Text>Back To Hub</Text>
        </Link>}
        {variant === 3 && <Link as={RouterLink} to={`${to}`} display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Icon as={IoArrowBack} fontSize={"1.25em"}/>
          <Text>{title}</Text>
        </Link>}
      </Flex>
        
      <Spacer/>
      <Heading as={"h1"}>Ambient Forest Admin</Heading>
      <Spacer/>
      <Flex w={"20%"} gap={"2em"} justifyContent={"end"}>
        <Link href='https://app.getform.io/login' display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Text>Link To Contact Forms</Text>
        </Link>
        <Link href='https://stripe.com/gb' display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Text>Link To Stripe</Text>
        </Link>
        <Link as={RouterLink} to={"/"} onClick={logOut} display={"flex"} alignItems={"center"} gap={"0.5em"} _hover={{color: "#373233", textDecor: "underline"}}>
          <Text>Sign Out</Text>
        </Link>
      </Flex>
        
    </Stack>
  )
}

export default Navbar