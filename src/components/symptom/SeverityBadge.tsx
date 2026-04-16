type Severity = "mild" | "moderate" | "urgent";

interface SeverityBadgeProps {
  severity: Severity;
}

const severityClasses = {
  mild: "bg-green-100 text-green-800 border border-green-200",
  moderate: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  urgent: "bg-red-100 text-red-800 border border-red-200",
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${severityClasses[severity]}`}>
      Severity: {severity.toUpperCase()}
    </span>
  );
}