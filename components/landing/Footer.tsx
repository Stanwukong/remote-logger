import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Activity, Github, Twitter, MessageSquare } from "lucide-react"

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "/sdk", label: "SDK" },
      { href: "/integrations", label: "Integrations" },
      { href: "/changelog", label: "Changelog" },
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/guides", label: "Guides" },
      { href: "/blog", label: "Blog" },
      { href: "/community", label: "Community" },
      { href: "/status", label: "Status" },
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ]
  }
]

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">RemoteLogger</span>
            </div>
            <p className="text-muted-foreground text-sm">
              The developer's logging companion. Built for modern applications that demand clarity and control.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 RemoteLogger. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>All systems operational</span>
            </div>
            <span>•</span>
            <span>Built with ❤️ for developers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}