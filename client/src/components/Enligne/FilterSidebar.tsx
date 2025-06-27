import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    ageRange: [number, number];
    country: string;
    withPhotoOnly: boolean;
    onlineOnly: boolean;
  };
  onFiltersChange: (filters: any) => void;
  countries: string[];
}
<aside className="sidebar-horizontal bg-white ..."></aside>
 export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  countries,
}) => {
  const handleAgeRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange = [...filters.ageRange] as [number, number];
    newRange[type === 'min' ? 0 : 1] = value;
    onFiltersChange({ ...filters, ageRange: newRange });
  };

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      ageRange: [18, 99],
      country: '',
      withPhotoOnly: false,
      onlineOnly: false,
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    <nav className="flex gap-4 text-sm font-medium">   
  <aside
  className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-y-0' : '-translate-y-full lg:translate-y-0'
  }`}
>
  <div className="p-5 flex flex-wrap items-center justify-between gap-4">
    {/* Header */}
    <div className="flex items-center gap-2">
      <Filter className="w-5 h-5 text-gray-800" />
      <h2 className="text-lg font-semibold text-gray-800">Filtres de recherche</h2>
    </div>
    <button
      onClick={onClose}
      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
    >
      <X className="w-5 h-5" />
    </button>

    {/* Age Range */}
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-700">Âge :</span>
      <input
        type="number"
        min="18"
        max="100"
        value={filters.ageRange[0]}
        placeholder="Min"
        onChange={(e) => handleAgeRangeChange('min', parseInt(e.target.value))}
        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
      />
      <span>-</span>
      <input
        type="number"
        min="18"
        max="100"
        value={filters.ageRange[1]}
        placeholder="Max"
        onChange={(e) => handleAgeRangeChange('max', parseInt(e.target.value))}
        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
      />
    </div>

    {/* Country */}
    <select
      value={filters.country}
      onChange={(e) => handleFilterChange('country', e.target.value)}
      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
    >
      <option value="">Tous les pays</option>
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>

    {/* Checkboxes */}
    <div className="flex items-center gap-4 text-sm text-gray-700">
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={filters.withPhotoOnly}
          onChange={(e) =>
            handleFilterChange('withPhotoOnly', e.target.checked)
          }
          className="text-purple-600"
        />
        Avec photo
      </label>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={filters.onlineOnly}
          onChange={(e) =>
            handleFilterChange('onlineOnly', e.target.checked)
          }
          className="text-purple-600"
        />
        En ligne
      </label>
    </div>

    {/* Apply Button */}
    <button
      onClick={onClose}
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Appliquer
    </button>
  </div>
</aside>

          </nav>
    </>
  );
};

export default FilterSidebar;
