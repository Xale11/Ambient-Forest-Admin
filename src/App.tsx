import { useEffect } from 'react'
import { Product } from './data/ProductData'
import AddEntity from './temps/AddEntity'

function App() {

  const product: Product = {
    name: "car",
    basePrice: 1500,
    description: "Fast car",
    extraInfo: "really fast",
    maxBuy: 1,
    color: [
      {
        colorName: "Red",
        colorPriceAddOn: 15,
        sizes: [
          {
            sizeName: "xs",
            sizePriceAddOn: 20,
            stock: 10
          },
          {
            sizeName: "lg",
            sizePriceAddOn: 70,
            stock: 2
          }
        ]
      },
      {
        colorName: "Blue",
        colorPriceAddOn: 15,
        sizes: [
          {
            sizeName: "md",
            sizePriceAddOn: 20,
            stock: 10
          },
          {
            sizeName: "xl",
            sizePriceAddOn: 70,
            stock: 2
          }
        ]
      }
    ]
  }

  useEffect(() => {
    const colors = product.color.filter((item) => item.colorName === "Red")
    console.log(colors)
  }, [])

  return (
    <>
      <AddEntity/>
    </>
  )
}

export default App
