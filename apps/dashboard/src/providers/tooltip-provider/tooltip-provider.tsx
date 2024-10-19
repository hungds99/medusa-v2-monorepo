"use client"

import * as Primitives from "@radix-ui/react-tooltip"

interface TooltipProviderProps extends Primitives.TooltipProviderProps {}

const TooltipProvider = ({
  children,
  delayDuration = 100,
  skipDelayDuration = 300,
  ...props
}: TooltipProviderProps) => {
  return (
    <Primitives.TooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    >
      {children}
    </Primitives.TooltipProvider>
  )
}

export { TooltipProvider }
