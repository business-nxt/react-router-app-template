import * as React from "react"

import { cn } from "~/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  invalid?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, success, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "ga-input",
          invalid && "ga-input--invalid",
          success && "ga-input--success",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
