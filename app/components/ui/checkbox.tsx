import * as React from "react"
import { Check, Minus } from "lucide-react"

import { cn } from "~/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  invalid?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, invalid, ...props }, ref) => (
    <label className={cn("ga-checkbox", invalid && "ga-checkbox--invalid", className)}>
      <input
        type="checkbox"
        className="ga-checkbox__native"
        ref={ref}
        {...props}
      />
      <span className="ga-checkbox__marker">
        <Check className="ga-checkbox__marker__indicator-checked h-4 w-4" />
        <Minus className="ga-checkbox__marker__indicator-indeterminate h-4 w-4" />
      </span>
      {label && <span className="ga-checkbox__label">{label}</span>}
    </label>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
