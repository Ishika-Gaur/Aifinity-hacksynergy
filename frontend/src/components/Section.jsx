import React from "react";
import Container from "./Container";


const BACKGROUND_CLASSES = {
  white: "bg-[var(--color-surface)]",
  tint: "bg-[var(--color-primary-50)]",
  dark: "bg-[var(--color-navy)] text-white",
};

export default function Section({
  children,
  background = "white",
  containerSize = "default",
  id,
  className = "",
}) {
  return (
    <section
      id={id}
      className={[
        "py-16 sm:py-20 lg:py-24",
        BACKGROUND_CLASSES[background] || BACKGROUND_CLASSES.white,
        className,
      ].join(" ")}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}