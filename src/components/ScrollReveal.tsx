import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

type Animation = "fadeUp" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleUp" | "slideDown";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}

const ANIMATIONS: Record<Animation, { hidden: CSSProperties; visible: CSSProperties }> = {
  fadeUp: {
    hidden: { opacity: 0, transform: "translateY(48px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
  fadeLeft: {
    hidden: { opacity: 0, transform: "translateX(-48px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  fadeRight: {
    hidden: { opacity: 0, transform: "translateX(48px)" },
    visible: { opacity: 1, transform: "translateX(0)" },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, transform: "scale(0.88)" },
    visible: { opacity: 1, transform: "scale(1)" },
  },
  slideDown: {
    hidden: { opacity: 0, transform: "translateY(-32px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
  },
};

export default function ScrollReveal({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 700,
  className,
  style,
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const anim = ANIMATIONS[animation];
  const baseStyle: CSSProperties = {
    ...(visible ? anim.visible : anim.hidden),
    transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={baseStyle}>
      {children}
    </div>
  );
}
