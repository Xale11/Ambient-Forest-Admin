import { VStack } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import Title from '../components/Title'
import LinkButton from '../components/LinkButton'

const Hub = () => {

  return (
    <VStack bg={"primary"} w={"100vw"} h={"100vh"} justify={"start"} >
      <Navbar variant={1}/>
      <Title title='Hub'/>
      <VStack w={"100%"} pt={"2em"} overflowY={"auto"} overflowX={"hidden"}>
        <LinkButton variant={1} to="/products" title="Products"/>
        <LinkButton variant={1} to="/home" title="Home Page"/>
        <LinkButton variant={1} to="/ourStory" title="Our Story Page"/>
        <LinkButton variant={1} to="/contact" title="Contact Page"/>
        <LinkButton variant={1} to="/terms" title="Terms Page"/>
        <LinkButton variant={1} to="/cart" title="Cart Page & Delivery Prices"/>
      </VStack>
    </VStack>
  )
}

export default Hub