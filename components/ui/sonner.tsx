"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--bg-surface)",
          "--normal-text": "var(--text-primary)",
          "--normal-border": "var(--border-subtle)",
          "--success-bg": "hsl(195 30% 8%)",
          "--success-border": "hsl(195 30% 14%)",
          "--success-text": "var(--signal)",
          "--error-bg": "hsl(358 76% 10%)",
          "--error-border": "hsl(357 89% 16%)",
          "--error-text": "var(--status-danger)",
          "--warning-bg": "hsl(50 100% 6%)",
          "--warning-border": "hsl(50 100% 9%)",
          "--warning-text": "var(--status-warn)",
          "--info-bg": "hsl(210 40% 8%)",
          "--info-border": "hsl(210 40% 14%)",
          "--info-text": "var(--level-info)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
