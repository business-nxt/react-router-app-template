import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const tabsVariants = cva(
  "ga-tabs",
  {
    variants: {
      orientation: {
        horizontal: "ga-tabs--horizontal",
        vertical: "ga-tabs--vertical",
      },
      keyline: {
        true: "ga-tabs--keyline",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsVariants> {}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, orientation, keyline, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    orientation={orientation}
    {...props}
  >
    {props.children}
  </TabsPrimitive.Root>
))
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsVariants>
>(({ className, orientation, keyline, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsVariants({ orientation, keyline }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { disabled?: boolean }
>(({ className, disabled, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "ga-tabs__tab",
      disabled && "ga-tabs__tab--disabled",
      className
    )}
    data-state-override={props["data-state"]}
    {...props}
  >
    {props.children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2", className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
