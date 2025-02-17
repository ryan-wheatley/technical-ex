import { toast } from "react-hot-toast"

export const toastService = {
  success: (message: string) => {
    toast.success(message, {
      position: "bottom-center",
      duration: 3000,
    })
  },
}
