"use client"

import * as React from "react"
import { cn } from "@/src/lib/utils"

// Common props for both div and button versions
interface CardBaseProps {
  isLoading?: boolean
  variant?: "default" | "elevated" | "glass"
  actionLabel?: string
  className?: string
  children?: React.ReactNode
}

// Props when Card renders as a button
type CardButtonProps = CardBaseProps & {
  action: () => void // `action` makes it a button
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CardBaseProps | 'onClick'> & {
  onClick?: React.MouseEventHandler<HTMLButtonElement> // Allow consumer to provide an additional onClick
};

// Props when Card renders as a div
type CardDivProps = CardBaseProps & {
  action?: never // `action` is not present
} & Omit<React.HTMLAttributes<HTMLDivElement>, keyof CardBaseProps>;

type CardProps = CardButtonProps | CardDivProps;

// Base Styles
const baseStyles = {
  default: "bg-gray-900/40 border-logo-purple/20",
  elevated: "bg-gray-800/70 border-logo-cyan/20 shadow-xl hover:shadow-logo-cyan/20",
  glass: "bg-gray-900/60 border border-white/10 backdrop-blur-md shadow-lg",
}

const Card = React.forwardRef<
  HTMLButtonElement | HTMLDivElement, // Ref can be for a button or a div
  CardProps
>(({ className, isLoading, variant = "default", action, actionLabel, children, ...restProps }, ref) => {
  const commonClassNames = cn(
    "rounded-lg border text-card-foreground shadow-sm transition-all duration-300",
    baseStyles[variant!], // variant has a default, so ! is safe
    isLoading && "animate-pulse",
    className
  );

  if (action) {
    // Card is a button
    const { onClick: consumerOnClick, ...buttonSpecificProps } = restProps as Omit<CardButtonProps, keyof CardBaseProps | 'action'>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          commonClassNames,
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-logo-cyan"
        )}
        aria-label={actionLabel}
        onClick={(e) => {
          action(); // Call the primary action
          consumerOnClick?.(e); // Call consumer's onClick if provided
        }}
        tabIndex={0}
        {...buttonSpecificProps}
      >
        {children}
      </button>
    );
  }

  // Card is a div
  const divSpecificProps = restProps as Omit<CardDivProps, keyof CardBaseProps | 'action'>;
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={commonClassNames} aria-label={actionLabel} {...divSpecificProps}>
      {children}
    </div>
  );
});
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight",
      "bg-clip-text text-transparent bg-gradient-to-r from-logo-purple to-logo-cyan",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0 border-t border-gray-800 mt-auto",
      "transition-all duration-200 hover:bg-gray-900/50",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
