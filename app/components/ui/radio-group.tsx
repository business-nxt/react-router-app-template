import * as React from "react"

import { cn } from "~/lib/utils"

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ga-radio-group", className)}
    {...props}
  />
))
RadioGroup.displayName = "RadioGroup"

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  invalid?: boolean
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, invalid, ...props }, ref) => (
    <label className={cn("ga-radio-button", invalid && "ga-radio-button--invalid", className)}>
      <input
        type="radio"
        className="ga-radio-button__native"
        ref={ref}
        {...props}
      />
      <span className="ga-radio-button__marker" />
      {label && <span className="ga-radio-button__label">{label}</span>}
    </label>
  )
)
Radio.displayName = "Radio"

export { RadioGroup, Radio }
