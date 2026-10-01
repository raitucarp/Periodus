import { ChakraProvider } from "@chakra-ui/react"
import { system } from "@/theme"
import { ColorModeProvider } from "@/components/ui/color-mode"
import type { PropsWithChildren } from "react"

export function Provider({ children }: PropsWithChildren) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}
