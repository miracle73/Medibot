interface ConditionCardProps {
  name: string;
  confidence: number;
  description: string;
}

export function ConditionCard({ name, confidence, description }: ConditionCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-medium text-gray-900">{name}</h4>
        <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-1 rounded-full">
          {confidence}% confidence
        </span>
      </div>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}