import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-24">
      <Card className="max-w-2xl mx-auto text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Stay updated</CardTitle>
          <CardDescription>Get the latest updates on new features, integrations, and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email" type="email" className="flex-1" />
            <Button>Subscribe</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe at any time. Read our privacy policy.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}