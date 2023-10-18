"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@libs/utils"

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, 
React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  let indicatorColorClass = "bg-slate-900"
  if ((value != undefined) && (value != null)){
    if (value <= 25){
      indicatorColorClass = "bg-red-900"
    }
    else if (value <= 50){
      indicatorColorClass = "bg-orange-900"
    }
    else if (value <= 75){
      indicatorColorClass = "bg-yellow-900"
    }
    else{
      indicatorColorClass = "bg-green-900"
    }
  }
  return (
  <ProgressPrimitive.Root ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      // className="h-full w-full flex-1 bg-slate-900 transition-all dark:bg-slate-50"
      className={`h-full w-full flex-1 transition-all dark:bg-slate-50 ${indicatorColorClass}`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)`}}
    />
  </ProgressPrimitive.Root>
)}
)
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
