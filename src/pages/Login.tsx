import { Box, Button, FormLabel, Heading, Input, useToast, VStack } from '@chakra-ui/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../firebase/firebase'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()
  const toast = useToast()
  
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const login = async () => {
    try{
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/hub")
    } catch (error) {
      console.error(error)
      toast({
        title: "Login Failed",
        description: "Please make sure you have entered your details correctly.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      })
    }
    
    
  }

  useEffect(() => {
    if (auth?.currentUser != null){
      navigate("/hub")
    }
  }, [auth, email, password])
  
  return (
    <VStack bg={"primary"} w={"100vw"} h={"100vh"} justify={"center"} spacing={"3em"}>
      <Heading as={"h1"} justifySelf={"start"}>Ambient Forest Admin</Heading>
      <VStack bg={"white"} w={{base: "90%", lg: "50%"}} p={"1em"} spacing={"1em"} align={"center"} borderRadius={"1.5em"}>
        <Box w={"90%"}>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} bg={"primary"} p={"1.5em 0.5em"} name='email' id='email' placeholder='Enter email...' borderRadius={"0.5em"} border={"none"} _focus={{boxShadow: "none"}}/>
        </Box>
        <Box w={"90%"}>
          <FormLabel>Password</FormLabel>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} bg={"primary"} p={"1.5em 0.5em"} name='password' id='password' placeholder='Enter password...' type='password' borderRadius={"0.5em"} border={"none"} _focus={{boxShadow: "none"}}/>
        </Box>
        <Button onClick={login} bg={"black1"} color={"white"} p={"0em 2em"} _hover={{bg: "darkgray"}}>Login</Button>
      </VStack>
    </VStack>
  )
}

export default Login