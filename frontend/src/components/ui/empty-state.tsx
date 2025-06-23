import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className = "text-center py-8 text-gray-500",
}) => {
  return (
    <div className={className}>
      <div className="mb-4">
        {icon}
      </div>
      <p className="text-lg font-medium text-gray-900 mb-2">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}; 