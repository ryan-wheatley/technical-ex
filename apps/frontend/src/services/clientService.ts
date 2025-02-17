type ClientFormData = {
  firstName: string
  lastName: string
  email: string
  dob: string
}

export async function createClient(formData: ClientFormData) {
  const response = await fetch(`${import.meta.env.VITE_API}/client/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    throw new Error("Network response was not ok")
  }

  return response.json()
}

export async function createCheck(
  clientId: string,
  checkRequest: { documentId: string },
) {
  return fetch(`${import.meta.env.VITE_API}/client/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId,
      ...checkRequest,
    }),
  })
}

export async function getCheck(
  checkId: string,
  firstName: string,
  lastName: string,
  dob: string,
) {
  return fetch(
    `${import.meta.env.VITE_API}/client/check?checkId=${checkId}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&dob=${dob}`,
  )
}
