import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const badgeVariants = cva(
  "ga-badge ga-badge--text",
  {
    variants: {
      variant: {
        default: "ga-badge--default",
        "default-inverted": "ga-badge--default-inverted",
        muted: "ga-badge--muted",
        information: "ga-badge--information",
        error: "ga-badge--error",
        warning: "ga-badge--warning",
        success: "ga-badge--success",
        disabled: "ga-badge--disabled",
        "disabled-inverted": "ga-badge--disabled-inverted",
      },
      size: {
        text: "ga-badge--text",
        dot: "ga-badge--dot",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "text",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
