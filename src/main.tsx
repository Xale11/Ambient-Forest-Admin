import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { allRoutes } from './routes/routes.tsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_G9hRpNzQd",
  client_id: "3qko24u9fum5fjhglleh07hv39",
  redirect_uri: "http://localhost:5173/hub",
  response_type: "code",
  scope: "phone openid email",
};

const router = createBrowserRouter([
  ...allRoutes,
])

const theme = extendTheme({
  colors: {
    primary: "#FFDDB0",
    black1: "#1E1E1E"
  },
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
     <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router}/>
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
    
  </StrictMode>,
)
