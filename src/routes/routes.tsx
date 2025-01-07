import ProductsList from "../pages/ProductsList"
import Hub from "../pages/Hub"
import Login from "../pages/Login"
import UploadProducts from "../pages/UploadProducts"
import UpdateProducts from "../pages/UpdateProducts"
import EditHomePage from "../pages/EditHomePage"
import EditContactPage from "../pages/EditContactPage"
import EditOurStoryPage from "../pages/EditOurStoryPage"
import EditTermsPage from "../pages/EditTermsPage"
import EditCartPage from "../pages/EditCartPage"

export const allRoutes = [
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/hub",
    element: <Hub/>
  },
  {
    path: "/products",
    element: <ProductsList/>
  },
  {
    path: "/products/form/upload",
    element: <UploadProducts/>
  },
  {
    path: "/products/form/update",
    element: <UpdateProducts/>
  },
  {
    path: "/home",
    element: <EditHomePage/>
  },
  {
    path: "/contact",
    element: <EditContactPage/>
  },
  {
    path: "/ourStory",
    element: <EditOurStoryPage/>
  },
  {
    path: "/terms",
    element: <EditTermsPage/>
  },
  {
    path: "/cart",
    element: <EditCartPage/>
  },
]