import { Clapperboard } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/50 mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Clapperboard className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                <span className="text-foreground">Cinema</span>
                <span className="text-accent">topia</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your destination for discovering the best in cinema and television entertainment.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Navigate</h4>
            <ul className="space-y-3">
              {["Home", "Explore", "TV Shows", "Mood Match"].map((item) => (
                <li key={item}>
                  <Link
                    href={
                      item === "Home"
                        ? "/"
                        : item === "Mood Match"
                          ? "/mood"
                          : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@cinematopia.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@cinematopia.com
                </a>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} <span className="text-foreground">Cinema</span>
            <span className="text-accent">topia</span>. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Powered by TMDB</p>
        </div>
      </div>
    </footer>
  )
}
