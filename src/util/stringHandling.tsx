export const makeFirstLetterUpper = (string: string) => {
  if (!string){
    return string
  }
  const firstLetter = string.charAt(0)

  const firstLetterCap = firstLetter.toUpperCase()

  const remainingLetters = string.slice(1)

  const capitalizedWord = firstLetterCap + remainingLetters

  return capitalizedWord
}