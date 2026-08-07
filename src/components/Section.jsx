import React from "react";
import Container from "./Container";


const BACKGROUND_CLASSES = {
  white: "bg-white",
  tint: "bg-blue-50/60",
  dark: "bg-slate-900 text-white",
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