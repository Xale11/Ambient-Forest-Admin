// AwsLogin.js

import { Alert, AlertIcon, Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";
import { signOutRedirect } from "../util/authHandling";

function AwsLogin() {
  const auth = useAuth();


  const logOut = async () => {
    if (auth.isAuthenticated){
      await auth.removeUser()
    }
    signOutRedirect()
  }
 
  // <button onClick={() => signOutRedirect()}>Sign out</button>
  return (
    <VStack bg={"primary"} w={"100vw"} h={"100vh"} justify={"center"} spacing={"1em"}>
      <Heading as={"h1"} justifySelf={"start"}>Ambient Forest Admin</Heading>
      {auth.isAuthenticated && <Heading size={"xs"}>Hello: {auth.user?.profile.email}</Heading>}
      <VStack bg={"white"} w={{base: "90%", lg: "50%"}} p={"1em"} spacing={"1em"} align={"center"} borderRadius={"1.5em"}>
        <ButtonGroup>
          <Button onClick={logOut} isLoading={auth.isLoading} bg={"black1"} color={"white"} p={"0em 2em"} _hover={{bg: "darkgray"}}>Log Out</Button>
          <Button onClick={() => auth.signinRedirect()} isLoading={auth.isLoading} bg={"black1"} color={"white"} p={"0em 2em"} _hover={{bg: "darkgray"}}>Login</Button>
        </ButtonGroup>
        {auth.error && <Alert status="error">
          <AlertIcon />
          Encountering error... {auth?.error?.message}
        </Alert>}
      </VStack>
    </VStack>
  );
}
  
export default AwsLogin;