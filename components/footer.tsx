import { Facebook, Twitter, Instagram, Film } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-background/80 border-t border-accent/30 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section - Branding */}
        <div className="mb-12 pb-8 border-b border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <Film className="w-5 h-5 text-background" />
            </div>
            <h2 className="text-2xl font-bold text-accent">Cinematopia</h2>
          </div>
          <p className="text-foreground/70 max-w-md">
            Discover the best movies and TV shows with stunning trailers, cast information, and comprehensive entertainment details.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-accent font-bold mb-4 text-sm uppercase tracking-wider">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">About Cinematopia</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Our Story</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-accent font-bold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2">
              <li><a href="mailto:jibrilnurjibril34@gmail.com" className="text-foreground/60 hover:text-accent transition text-sm">jibrilnurjibril34@gmail.com</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Support</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Feedback</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-accent font-bold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Careers</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Press Kit</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Partnerships</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-accent font-bold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-accent transition text-sm">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-accent/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm text-center md:text-left">
            © 2025 Cinematopia. All rights reserved by Cinematopia.
          </p>
          <div className="flex gap-5">
            <a href="https://x.com/nurjibril_jibril" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-accent transition duration-300" aria-label="X">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/nurjibril_jibril/" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-accent transition duration-300" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://web.facebook.com/nurjibril.jibril" target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-accent transition duration-300" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
