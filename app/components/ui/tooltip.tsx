import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipVariants = cva(
  "ga-tooltip",
  {
    variants: {
      side: {
        top: "ga-tooltip--top-center",
        bottom: "ga-tooltip--bottom-center",
        left: "ga-tooltip--left-center",
        right: "ga-tooltip--right-center",
      },
    },
    defaultVariants: {
      side: "top",
    },
  }
)

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  title?: string
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, side = "top", sideOffset = 4, title, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    side={side}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ side }), className)}
    {...props}
  >
    {title && <div className="ga-tooltip__title">{title}</div>}
    {children}
  </TooltipPrimitive.Content>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
