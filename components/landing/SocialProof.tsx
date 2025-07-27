const companies = ["TechCorp", "StartupXYZ", "DevTools Inc", "CloudNative", "DataFlow", "APIFirst"]

export function SocialProof() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-muted-foreground mb-8">Trusted by teams at</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
          {companies.map((company) => (
            <div key={company} className="text-lg font-semibold">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}