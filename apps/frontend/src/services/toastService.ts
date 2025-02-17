import { toast } from "react-hot-toast";

export const toastService = {
  success: (message: string) => {
    toast.success(message, {
      position: "bottom-right",
      duration: 3000,
    });
  },
};
