"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextType {
  value: string | string[]
  toggleItem: (value: string) => void
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined)

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
}

function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(() => {
    if (defaultValue !== undefined) return defaultValue
    return type === "single" ? "" : []
  })

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      let newValue: string | string[]
      if (type === "single") {
        if (value === itemValue) {
          newValue = collapsible ? "" : itemValue
        } else {
          newValue = itemValue
        }
      } else {
        const currentArr = Array.isArray(value) ? value : []
        if (currentArr.includes(itemValue)) {
          newValue = currentArr.filter((v) => v !== itemValue)
        } else {
          newValue = [...currentArr, itemValue]
        }
      }

      if (controlledValue === undefined) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [type, collapsible, value, controlledValue, onValueChange]
  )

  return (
    <AccordionContext.Provider value={{ value, toggleItem }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextType {
  value: string
  isOpen: boolean
}

const AccordionItemContext = React.createContext<AccordionItemContextType | undefined>(undefined)

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion")
  }

  const isOpen = Array.isArray(context.value)
    ? context.value.includes(value)
    : context.value === value

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn("border border-border/60 rounded-2xl bg-card overflow-hidden transition-colors", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const accordionContext = React.useContext(AccordionContext)
  const itemContext = React.useContext(AccordionItemContext)

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionTrigger must be used within an AccordionItem")
  }

  return (
    <div className="flex">
      <button
        type="button"
        data-state={itemContext.isOpen ? "open" : "closed"}
        onClick={() => accordionContext.toggleItem(itemContext.value)}
        className={cn(
          "flex flex-1 items-center justify-between p-4 text-left font-bold text-sm sm:text-base text-foreground transition-all hover:bg-muted/30 cursor-pointer group [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </button>
    </div>
  )
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const itemContext = React.useContext(AccordionItemContext)

  if (!itemContext) {
    throw new Error("AccordionContent must be used within an AccordionItem")
  }

  if (!itemContext.isOpen) return null

  return (
    <div
      data-state={itemContext.isOpen ? "open" : "closed"}
      className={cn("px-4 pb-4 pt-1 text-xs sm:text-sm text-muted-foreground border-t border-border/40 bg-muted/10 leading-relaxed animate-in fade-in-50 duration-200", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
