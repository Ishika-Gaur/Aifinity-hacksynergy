import React from "react";

const SIZE_CLASSES = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export default function Container({
  children,
  size = "default",
  className = "",
}) {
  return (
    <div
      className={[
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        SIZE_CLASSES[size] || SIZE_CLASSES.default,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}