import Banner from '@/components/Banner'
import PriceList from '@/components/PriceList'
import ReviewList from '@/components/ReviewList'
import ReviewForm from '@/components/ReviewForm'
import ContactInfo from '@/components/ContactInfo'
import LocationInfo from '@/components/LocationInfo'
import Footer from '@/components/Footer'
import ClientService from './services/ClientService'
import Gallery from '@/components/Gallery'
export default function Home() {
  return (
    <ClientService>
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Banner />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        <section id="services" className="scroll-mt-16 animate-fade-in">
          <PriceList />
        </section>
        <section id="gallery" className="scroll-mt-16 animate-fade-in">
          <Gallery />
        </section>
        <section id="reviews" className="scroll-mt-16 animate-fade-in">
          <ReviewList />
          <ReviewForm />
        </section>
        <section id="contact" className="scroll-mt-16 animate-fade-in">
          <ContactInfo />
          <LocationInfo />
        </section>
      </div>
      <Footer />
    </main>
    </ClientService>
  )
}

