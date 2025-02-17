import React, { createContext, useContext, useState } from "react"
import { usePollCheck } from "../hooks/usePollCheck.ts"

export type TProvidedInfo = { firstName: string; lastName: string; dob: string }

type VerificationContextType = {
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  client: any
  setClient: React.Dispatch<React.SetStateAction<any>>
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
  result: string
  setResult: React.Dispatch<React.SetStateAction<string>>
  setCheckId: React.Dispatch<React.SetStateAction<string | null>>
  setProvidedInfo: React.Dispatch<React.SetStateAction<TProvidedInfo>>
  providedInfo: TProvidedInfo
}

const VerificationContext = createContext<VerificationContextType | undefined>(
  undefined,
)

export const VerificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [token, setToken] = useState<string | null>(null)
  const [client, setClient] = useState<any>(null)
  const [checkId, setCheckId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [providedInfo, setProvidedInfo] = useState<TProvidedInfo>({
    firstName: "",
    lastName: "",
    dob: "",
  })

  usePollCheck(checkId, setStatus, setResult, providedInfo)

  return (
    <VerificationContext.Provider
      value={{
        token,
        setToken,
        client,
        setClient,
        status,
        setStatus,
        result,
        setResult,
        setCheckId,
        setProvidedInfo,
        providedInfo,
      }}
    >
      {children}
    </VerificationContext.Provider>
  )
}

export const useVerificationContext = (): VerificationContextType => {
  const context = useContext(VerificationContext)
  if (!context) {
    throw new Error(
      "useVerificationContext must be used within a VerificationProvider",
    )
  }
  return context
}
