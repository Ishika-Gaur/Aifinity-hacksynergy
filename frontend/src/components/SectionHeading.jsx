export default function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
