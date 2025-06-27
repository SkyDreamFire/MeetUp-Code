import React from 'react';
import { SlidersHorizontal, Clock, Image, Heart, Star } from 'lucide-react';

interface SortingBarProps {
  onToggleFilters: () => void;
  activeSort: string;
  onSortChange: (sort: string) => void;
  resultsCount: number;
}

const SortingBar: React.FC<SortingBarProps> = ({
  onToggleFilters,
  activeSort,
  onSortChange,
  resultsCount
}) => {
  const sortOptions = [
    { id: 'recent', label: 'Récemment en ligne', icon: Clock },
    { id: 'photo', label: 'Avec photo', icon: Image },
    { id: 'matches', label: 'Correspondances', icon: Heart },
    { id: 'featured', label: 'Membres vedettes', icon: Star }
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results count and filter toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleFilters}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
          <span className="text-gray-600">
            {resultsCount} membre{resultsCount > 1 ? 's' : ''} trouvé{resultsCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* Sort options */}
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => onSortChange(option.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSort === option.id
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SortingBar;