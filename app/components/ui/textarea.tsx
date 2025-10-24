import * as React from "react"

import { cn } from "~/lib/utils"

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  invalid?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "ga-text-area",
          invalid && "ga-text-area--invalid",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
