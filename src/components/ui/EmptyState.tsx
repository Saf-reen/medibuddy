import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message = 'Try adjusting your search or filter criteria.',
  icon,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          {icon || <Search className="w-8 h-8 text-gray-400" />}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md">{message}</p>
        </div>
      </div>
    </div>
  );
};