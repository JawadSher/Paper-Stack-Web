"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TypewriterWord = {
  text: string;
  className?: string;
};

type TypewriterEffectProps = {
  words: TypewriterWord[];
  className?: string;
  cursorClassName?: string;
};

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
}: TypewriterEffectProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <span className={cn("inline", className)}>
        {words.map((word, wordIndex) => (
          <span key={`${word.text}-${wordIndex}`} className={word.className}>
            {word.text}
            {wordIndex < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  let characterIndex = 0;

  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, wordIndex) => (
        <span key={`${word.text}-${wordIndex}`} className="mr-[0.25em]">
          {word.text.split("").map((character, index) => {
            const delay = characterIndex * 0.045;
            characterIndex += 1;

            return (
              <motion.span
                key={`${word.text}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.01, delay }}
                className={cn("inline-block", word.className)}
              >
                {character}
              </motion.span>
            );
          })}
        </span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          delay: characterIndex * 0.045,
          duration: 0.8,
          repeat: Infinity,
          repeatDelay: 0.15,
        }}
        className={cn("ml-1 inline-block w-[0.08em]", cursorClassName)}
      />
    </span>
  );
}
