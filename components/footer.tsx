import { Facebook, Twitter, Instagram, Film } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Film className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Cinematopia</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Discover the best movies and TV shows with stunning trailers, cast information, and comprehensive
              entertainment details.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">About</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-accent transition">
                  About Cinematopia
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="mailto:hello@cinematopia.com" className="hover:text-accent transition">
                  hello@cinematopia.com
                </a>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Cinematopia. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-accent transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
