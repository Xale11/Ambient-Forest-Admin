import { Box, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from "@chakra-ui/react"

interface Props {
  variant: number
  label: string
  w?: string,
  id: string,
  name: string,
  choiceArray?: {label: string, value: string}[]
  placeholder?: string
  value: string
  setValue: (value: string) => void
  step?: number
  precision?: number | undefined
}

// InputFormV2 is very similar to the original InputForm however instead of the setValue being strictly a string setState
// It can be any function that accepts a string as the input. This includes setState and more. Gives setValue more functionality.

const InputFormV2 = ({variant, label, w, id, name, placeholder, value, setValue, precision, step}: Props) => {
  return (
    <Box w={`${w ? w : "95%"}`}>
      <FormLabel>{label}</FormLabel>
      {/* Simple Text Input */}
      {variant == 1 && <Input value={value} onChange={(e) => setValue(e.target.value)} bg={"primary"} p={"1.5em 0.5em"} name={`${name}`} id={`${id}`} placeholder={`${placeholder ? placeholder : 'Type here...'}`} borderRadius={"0.5em"} border={"none"} _focus={{boxShadow: "none"}}/>}
      {/* Textarea e.g. writing a writing a message */}
      {variant == 2 && <Textarea value={value} onChange={(e) => setValue(e.target.value)} bg={"primary"} name={`${name}`} id={`${id}`} placeholder={`${placeholder ? placeholder : 'Type here...'}`} h={"10em"} borderRadius={"0.5em"} border={"none"} _focus={{boxShadow: "none"}}/>}
      {/* Number Input with stepper control */}
      {variant == 3 && <NumberInput value={value} onChange={(valueString) => setValue(valueString)} defaultValue={0} precision={precision !== undefined ? precision : 2} step={step ? step : 0.01} min={0} bg={"primary"}  name={`${name}`} id={`${id}`} borderRadius={"0.5em"} m={"0em"} p={"0.25em 0em"} border={"rgba(0, 0, 0, 0.0)"}>
        <NumberInputField _focus={{boxShadow: "none", border: "none"}}/>
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>}
    </Box>
  )
}

export default InputFormV2