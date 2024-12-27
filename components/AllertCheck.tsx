import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AllertCheck() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Loading</AlertTitle>
      <AlertDescription>
       Mohon tunggu sebentar , kami sedang memuat data.
      </AlertDescription>
    </Alert>
  )
}
