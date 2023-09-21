'use client'

import { ParagraphProps, ParagraphVariant } from "@/components/ui/Paragraph"
import { cn } from "@/lib/utils"
import { FC, forwardRef, useEffect, useState } from "react"


interface AnnotatedParagraphProps extends ParagraphProps {
    show: boolean,
    animated?: boolean,
    animationDelay?: number,
}

const AnimatedParagraph = forwardRef<HTMLParagraphElement, AnnotatedParagraphProps>(
    ({className, size, children, show, animated, animationDelay, ...props}, ref) => {
        
        let allText = children!.toString();
        const [text, setText] = useState<string>(animated ? '' : allText)
        
        useEffect(() => {
            if (show && animated) {
              let i = 0
              setTimeout(() => {
                const intervalId = setInterval(() => {
                  setText(allText.slice(0, i))
                  i++
                  if (i > allText.length) {
                    clearInterval(intervalId)
                  }
                }, 15)
        
                return () => clearInterval(intervalId)
              }, animationDelay || 150)
            }
          }, [allText, show, animated, animationDelay])

        return (
        <p 
            ref={ref}
            {...props}
            className={cn(ParagraphVariant({size, className}))}>
            {text}
        </p>
        )
})

AnimatedParagraph.displayName = "AnimatedParagraph";

export default AnimatedParagraph;