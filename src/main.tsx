import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { allRoutes } from './routes/routes.tsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

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
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router}/>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>,
)
