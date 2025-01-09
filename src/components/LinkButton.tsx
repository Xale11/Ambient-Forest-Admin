import { Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

interface Props {
  variant: number
  to: string
  title: string
  onClick?: () => void
}
const LinkButton = ({variant, to, title, onClick}: Props) => {
  return (
    <Link onClick={onClick} as={RouterLink} to={`${to}`} bg={"black1"} color={"white"} textAlign={"center"} w={`${variant == 1 ? {base: "70%", lg: "20%"} : "auto"}`} fontSize={"lg"} p={"0.5em 2em"} borderRadius={"1em"} transition={"all 300ms ease-in-out"} _hover={{p: "0.5em 2.5em", color: "white", w: `${variant == 1 ? {base: "70%", lg: "22%"} : "auto"}` }}>
      {title}
    </Link>
  )
}

export default LinkButton