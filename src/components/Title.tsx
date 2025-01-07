import { Heading } from '@chakra-ui/react'

interface Props {
  title: string
}

const Title = ({title}: Props) => {
  return (
    <Heading as={"h2"} fontSize={"3xl"} fontWeight={"500"} pb={"0.5em"} textAlign={"center"}>{title}</Heading>
  )
}

export default Title