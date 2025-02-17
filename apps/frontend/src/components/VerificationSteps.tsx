import * as React from "react"
import { useEffect } from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Typography from "@mui/material/Typography"
import { AccessTimeFilled, Done, GppBad, Person } from "@mui/icons-material"
import { Card, CircularProgress } from "@mui/material"
import DetailsForm from "./DetailsForm.tsx"
import DocumentUploader from "./DocumentUploader.tsx"
import { toastService } from "../services/toastService.ts"
import { useVerificationContext } from "../contexts/VerificationContext.tsx"
import { ErrorIcon } from "react-hot-toast"

const verificationSteps = ["Provide details", "Upload document", "Verification"]

export default function VerificationSteps() {
  const [activeStep, setActiveStep] = React.useState(0)
  const { token, status, result, providedInfo } = useVerificationContext()

  useEffect(() => {
    if (token) {
      setActiveStep(1)
      toastService.success("Details submitted")
    }
  }, [token])

  useEffect(() => {
    if (status === "pending") {
      setActiveStep(2)
      toastService.success("Document uploaded successfully")
    }

    if (status === "complete" && result === "clear") {
      setTimeout(() => {
        // Hang on the verification step for a moment
        setActiveStep(3)
      }, 2000)

      toastService.success("Verification complete")
    }
  }, [status])

  return (
    <Box className={"w-full"}>
      <Stepper activeStep={activeStep}>
        {verificationSteps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>

      <div className="py-20 flex justify-center">
        {activeStep === 0 && <DetailsForm />}
        {activeStep === 1 && token && <DocumentUploader />}
        {activeStep === 2 &&
          (status === "complete" ||
            status === "pending" ||
            status === "failed") && (
            <div className="flex flex-col gap-20">
              <div className="flex flex-col items-center gap-5">
                <div className={"flex gap-2 items-center"}>
                  {status === "pending" && <AccessTimeFilled />}
                  Verification {status === "pending" ? "in progress" : status}
                </div>
                <Typography color={"textSecondary"}>
                  {status === "pending" &&
                    "Please wait while we verify your details"}
                  {status === "complete" &&
                    result === "fail" &&
                    "We were unable to verify your details"}
                  {status === "complete" &&
                    result === "not_processed" &&
                    "Something went wrong. Please try again"}
                </Typography>
              </div>
              <div className={"flex w-full flex-col gap-2"}>
                <Card
                  variant={"outlined"}
                  className="px-5 min-w-100 justify-between items-center flex w-full py-3"
                >
                  <div className="flex gap-2">
                    <Person />
                    {`${providedInfo.firstName}  ${providedInfo.lastName}`}
                  </div>
                  {status === "pending" && <CircularProgress size={20} />}

                  {/* clear verification  */}
                  {status === "complete" && result === "clear" && <Done />}

                  {/* non-clear verification*/}
                  {status === "complete" && result === "fail" && <GppBad />}

                  {/*  not processed verification */}
                  {status === "failed" && result === "not_processed" && (
                    <ErrorIcon />
                  )}
                </Card>
              </div>
            </div>
          )}
        {activeStep === 3 && (
          <div className={"text-center flex flex-col gap-10"}>
            <Typography color={"textPrimary"}>Verification complete</Typography>
            <Typography color={"textSecondary"}>
              Welcome to your account, you can now proceed to the next step.
            </Typography>
          </div>
        )}
      </div>
    </Box>
  )
}
