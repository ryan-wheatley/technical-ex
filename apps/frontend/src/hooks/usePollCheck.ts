import React, { useEffect } from "react"
import { getCheck } from "../services/clientService.ts"
import { TProvidedInfo } from "../contexts/VerificationContext.tsx"

const POLL_TIME = 5000

export const usePollCheck = (
  checkId: string | null,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  setResult: React.Dispatch<React.SetStateAction<string>>,
  providedInfo: TProvidedInfo,
) => {
  useEffect(() => {
    if (!checkId) return

    const interval = setInterval(async () => {
      const result = await getCheck(
        checkId,
        providedInfo.firstName,
        providedInfo.lastName,
        providedInfo.dob,
      )

      const data = await result.json()
      console.log(data)

      if (data.status === "complete") {
        clearInterval(interval)
        setStatus("complete")
        setResult(data.outcome)
      }

      if (data.status === "failed") {
        clearInterval(interval)
        setStatus("failed")
        setResult(data.outcome)
      }
    }, POLL_TIME)

    return () => clearInterval(interval)
  }, [checkId])
}
