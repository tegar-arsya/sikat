import { Button } from "@/components/ui/button"
import { PhoneCall, Mail, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactInfo() {
  return (
    <Card className="w-full bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center">Contact Us</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-xl mb-6">Need your shoes cleaned now? Get in touch with us!</p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <Button size="lg" variant="secondary" className="w-full md:w-auto">
            <PhoneCall className="mr-2 h-5 w-5" /> Call Us
          </Button>
          <Button size="lg" variant="secondary" className="w-full md:w-auto">
            <Mail className="mr-2 h-5 w-5" /> Email Us
          </Button>
          <Button size="lg" variant="secondary" className="w-full md:w-auto">
            <MapPin className="mr-2 h-5 w-5" /> Find Us
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

