import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden data-[pulse=true]:animate-[badge-pulse_2s_ease-in-out_infinite]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Observatory — Catalyst pattern: 10% bg, 20% border, full-saturation text
        signal:
          "bg-signal/10 text-signal border-signal/20",
        "status-ok":
          "bg-status-ok/10 text-status-ok border-status-ok/20",
        "status-warn":
          "bg-status-warn/10 text-status-warn border-status-warn/20",
        "status-danger":
          "bg-status-danger/10 text-status-danger border-status-danger/20",
        "level-error":
          "bg-level-error/10 text-level-error border-level-error/20",
        "level-warn":
          "bg-level-warn/10 text-level-warn border-level-warn/20",
        "level-info":
          "bg-level-info/10 text-level-info border-level-info/20",
        "level-debug":
          "bg-white/5 text-level-debug border-border-faint",
        "level-trace":
          "bg-white/[0.03] text-level-trace border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
