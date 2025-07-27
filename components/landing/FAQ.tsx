import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "How does LogHive handle data security?",
    answer: "LogHive takes security seriously. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We're SOC 2 Type II compliant and undergo regular security audits. Your logs are stored in isolated environments with strict access controls."
  },
  {
    question: "Can I integrate LogHive with my existing tools?",
    answer: "Yes! LogHive offers extensive integrations with popular tools like Slack, PagerDuty, Datadog, and more. We also provide webhooks and a comprehensive REST API for custom integrations. Our SDK supports all major programming languages and frameworks."
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer: "We'll notify you when you're approaching your limits. For the free plan, logging will be temporarily paused until the next billing cycle. For paid plans, you can choose to upgrade automatically or we'll work with you to find the best solution for your needs."
  },
  {
    question: "How long are logs retained?",
    answer: "Log retention varies by plan: 7 days for the free plan, 30 days for Professional, and custom retention periods for Enterprise customers. You can also export your logs at any time for long-term archival."
  },
  {
    question: "Do you offer on-premise deployment?",
    answer: "Yes, we offer on-premise and hybrid deployment options for Enterprise customers. This includes full support for air-gapped environments and custom compliance requirements. Contact our sales team to discuss your specific needs."
  },
  {
    question: "How fast can I get started?",
    answer: "You can start logging in under 2 minutes! Simply sign up, create a project, install our SDK, and you're ready to go. Our quick start guide and comprehensive documentation make integration seamless."
  }
]

export function FAQ() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          FAQ
        </Badge>
        <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Everything you need to know about LogHive
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}