import { useEffect, useRef } from "react"
import { useVerificationContext } from "../contexts/VerificationContext.tsx"
import { createCheck } from "../services/clientService.ts"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ComplyCube: any
  }
}

export default function DocumentUploader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { token, client, setStatus, setCheckId } = useVerificationContext()
  const complycubeRef = useRef<any>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.complycube.com/web-sdk/v1/complycube.min.js"
    script.async = true
    document.body.appendChild(script)

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://assets.complycube.com/web-sdk/v1/style.css"
    document.head.appendChild(link)

    script.onload = () => {
      if (window.ComplyCube) {
        complycubeRef.current = window.ComplyCube.mount({
          token,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onComplete: async (data: any) => {
            const createCheckResult = await createCheck(client.id, {
              documentId: data.documentCapture.documentId,
            })

            const { id } = await createCheckResult.json()

            setCheckId(id)
            setStatus("pending")

            setTimeout(() => {
              complycubeRef.current.updateSettings({ isModalOpen: false })
            }, 1000)
          },
        })
      }
    }

    return () => {
      if (complycubeRef.current) {
        complycubeRef.current.unmount()
      }
      document.body.removeChild(script)
      document.head.removeChild(link)
    }
  }, [token])

  return (
    <div>
      <div id="complycube-mount"></div>
    </div>
  )
}
