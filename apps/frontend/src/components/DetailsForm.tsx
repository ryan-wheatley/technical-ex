import { useState, useTransition } from "react"
import { Button, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { Dayjs } from "dayjs"
import Alert from "@mui/material/Alert"
import { createClient } from "../services/clientService"
import { useVerificationContext } from "../contexts/VerificationContext.tsx"

export default function DetailsForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { setToken, setClient, setProvidedInfo } = useVerificationContext()
  const [dob, setDob] = useState<Dayjs | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!dob) {
      return
    }

    const formattedDob = dob.format("YYYY-MM-DD")

    const payload = {
      ...formData,
      dob: formattedDob,
    }

    startTransition(async () => {
      try {
        const data = await createClient(payload)
        setClient(data.client)

        if (data.token) {
          setToken(data.token)
          setProvidedInfo({
            firstName: formData.firstName.toUpperCase(),
            lastName: formData.lastName.toUpperCase(),
            dob: formattedDob,
          })
        } else {
          setError("Something went wrong, please try again.")
        }
      } catch (err) {
        setError("Error submitting details.")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-[500px] flex-col gap-20">
      <div className="flex flex-col gap-4">
        <div>Sign up</div>

        <TextField
          id="outlined-basic"
          name="firstName"
          label="First Name"
          variant="outlined"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          type="text"
          name="lastName"
          variant="outlined"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="flex justify-between items-center">
          <div>Date of Birth:</div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dob}
              onChange={(newValue) => setDob(newValue)}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>

      <Button
        variant="outlined"
        loading={isPending}
        disabled={isPending}
        type="submit"
      >
        Submit details
      </Button>

      {error && <Alert severity="error">{error}</Alert>}
    </form>
  )
}
