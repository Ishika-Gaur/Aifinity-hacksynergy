export default function SectionHeading({ eyebrow, title, subtitle, className = '' }) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {eyebrow && (
        <span className="mb-3 inline-block text-sm font-semibold tracking-wide text-[var(--color-primary-600)]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-h)] mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}