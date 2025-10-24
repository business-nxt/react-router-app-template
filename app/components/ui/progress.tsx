import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const progressVariants = cva(
  "ga-progress",
  {
    variants: {
      variant: {
        default: "",
        success: "ga-progress--success",
        error: "ga-progress--error",
      },
      indeterminate: {
        true: "ga-progress--indeterminate",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number
  label?: string
  helper?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, indeterminate, value = 0, label, helper, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(progressVariants({ variant, indeterminate }), className)}
      {...props}
    >
      {label && <div className="ga-progress__label">{label}</div>}
      <div className="ga-progress__buffer">
        <div
          className="ga-progress__bar"
          style={{ transform: indeterminate ? undefined : `scaleX(${value / 100})` }}
        />
      </div>
      {helper && <div className="ga-progress__helper">{helper}</div>}
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }
