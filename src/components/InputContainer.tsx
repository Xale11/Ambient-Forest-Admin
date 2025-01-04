import { Text, VStack } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  w?: string
  p?: string
  h?: string
}

const InputContainer = ({title, children, w, p, h}: Props) => {
  return (
    <VStack bg={"white"} w={{base: "95%", lg: `${w ? w : "auto"}`}} h={`${h ? h : "auto"}`} borderRadius={"1em"} p={`${p ? p : "auto"}`}>
      <Text alignSelf={"start"} fontWeight={"bold"}>{title}</Text>
      {children}
    </VStack>
  )
}

export default InputContainer