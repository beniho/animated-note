"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { AnimationConfig, AnimationItemConfig } from "@/types/animation";

interface AnimatedTextProps {
  text: string;
  config: AnimationConfig;
  autoPlay?: boolean;
}

function splitText(
  text: string,
  target: AnimationItemConfig["targetType"]
): string[] {
  switch (target) {
    case "character":
      return Array.from(text);
    case "word":
      return text.split(/(\s+)/);
    case "line":
      return text.split(/\n/);
    case "paragraph":
      return text.split(/\n\n+/);
    default:
      return [text];
  }
}

export function AnimatedText({
  text,
  config,
  autoPlay = true,
}: AnimatedTextProps) {
  const prefersReduced = useReducedMotion();

  const segments = useMemo(
    () => splitText(text, config.animations[0]?.targetType || "word"),
    [text, config]
  );

  const baseVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0 },
  };

  const toEase = (easing?: string) => {
    switch (easing) {
      case "linear":
      case "easeIn":
      case "easeOut":
      case "easeInOut":
        return easing;
      default:
        return "easeInOut";
    }
  };

  const items = useMemo(() => {
    const anim = config.animations[0];
    if (!anim) return [] as { key: string; content: string; delay: number }[];
    const start = Math.max(0, anim.startIndex);
    const end = Math.min(segments.length, anim.endIndex ?? segments.length);
    const speed = (anim.duration ?? 800) / Math.max(1, end - start);
    return segments.map((content, i) => ({
      key: `${i}-${content}`,
      content,
      delay: i >= start && i < end ? (i - start) * speed : 0,
    }));
  }, [config, segments]);

  if (prefersReduced) {
    return <span>{text}</span>;
  }

  return (
    <span aria-label="animated-text">
      {items.map((it) => (
        <motion.span
          key={it.key}
          initial="hidden"
          animate={
            autoPlay && config.globalConfig.autoPlay ? "visible" : "hidden"
          }
          variants={baseVariants}
          transition={{
            delay: (config.animations[0]?.delay ?? 0) / 1000 + it.delay / 1000,
            duration: (config.animations[0]?.duration ?? 800) / 1000,
            ease: toEase(config.animations[0]?.easing as string | undefined),
          }}
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
        >
          {it.content}
        </motion.span>
      ))}
    </span>
  );
}

export default AnimatedText;
