import React, { useEffect, useRef, useState } from "react";
import Container from "./Container";

const BACKGROUND_CLASSES = {
  white: "bg-grid",
  tint: "bg-[var(--color-primary-50)]",
  dark: "bg-[var(--color-navy)] text-white",
};

export default function Section({
  children,
  background = "white",
  containerSize = "default",
  id,
  className = "",
  reveal = true,
}) {
  const ref = useRef(null);
  // If reveal is off, render fully visible from the start — no observer,
  // no flash of hidden content.
  const [isVisible, setIsVisible] = useState(!reveal);

  useEffect(() => {
    if (!reveal) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reveal]);

  return (
    <section
      ref={ref}
      id={id}
      className={[
        "py-16 sm:py-20 lg:py-24",
        BACKGROUND_CLASSES[background] || BACKGROUND_CLASSES.white,
        className,
      ].join(" ")}
    >
      <div
        className={[
          reveal ? "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0" : "",
          reveal && !isVisible ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0",
        ].join(" ")}
      >
        <Container size={containerSize}>{children}</Container>
      </div>
    </section>
  );
}