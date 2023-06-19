'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    className={cn(
      'inline-flex min-w-[100px] items-center justify-center rounded-[0.185rem] px-3 py-1.5  text-sm font-medium text-slate-700 transition-all  disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-200 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100',
      className
    )}
    {...props}
    ref={ref}
  />
))
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName