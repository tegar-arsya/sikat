import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="text-3xl font-bold mb-2">Katsikat Shoe Cleaning</h3>
            <p className="text-xl">Revive Your Kicks with Professional Care</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-secondary transition-colors">
              <Facebook size={32} />
            </a>
            <a href="#" className="hover:text-secondary transition-colors">
              <Instagram size={32} />
            </a>
            <a href="#" className="hover:text-secondary transition-colors">
              <Twitter size={32} />
            </a>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg">&copy; 2023 Katsikat Shoe Cleaning. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

