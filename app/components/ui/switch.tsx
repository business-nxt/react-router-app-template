import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "~/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  invalid?: boolean
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, invalid, ...props }, ref) => (
    <label className={cn("ga-switch", invalid && "ga-switch--invalid", className)}>
      <input
        type="checkbox"
        ref={ref}
        {...props}
      />
      <span className="ga-switch__marker">
        <Check className="ga-switch__check-icon h-3 w-3" />
        <span className="ga-switch__slider" />
      </span>
      {label && <span className="ga-switch__label">{label}</span>}
    </label>
  )
)
Switch.displayName = "Switch"

export { Switch }
