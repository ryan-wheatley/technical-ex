import { useMemo } from "react"
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material"
import VerificationSteps from "./components/VerificationSteps.tsx"
import { Toaster } from "react-hot-toast"
import { VerificationProvider } from "./contexts/VerificationContext.tsx"

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <div className="px-5 md:p-20 justify-center min-h-screen flex">
        <div className="container max-w-[800px]">
          <VerificationProvider>
            <VerificationSteps />
          </VerificationProvider>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
