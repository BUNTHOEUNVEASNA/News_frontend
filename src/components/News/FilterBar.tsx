import React from "react";
import { Search, Filter, Calendar, RefreshCw } from "lucide-react";
import { FilterOptions, Source } from "../../types";

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (newFilters: FilterOptions) => void;
  onRefresh?: () => void;
  loading?: boolean;
  sources: Source[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  loading = false,
  sources = [],
}) => {
  const normalizedSources = Array.isArray(sources) ? sources : [];

  const handleInputChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
      page: 1, // reset page on filter change
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
          <input
            type="text"
            placeholder="Search articles..."
            value={filters.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Source Filter */}
        {/* Source Filter */}
<div className="lg:w-48 relative">
  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
  <select
    value={filters.source || ""}
    onChange={(e) => handleInputChange("source", e.target.value)}
    className="input-field pl-10 appearance-none"
  >
    <option value="">All Sources</option>
    {normalizedSources.map((src) => (
      <option key={src.id} value={src.name}>
        {src.name}
      </option>
    ))}
  </select>
</div>



        {/* Date From */}
        <div className="lg:w-40 relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
          <input
            type="date"
            value={filters.date_from || ""}
            onChange={(e) => handleInputChange("date_from", e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Date To */}
        <div className="lg:w-40 relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
          <input
            type="date"
            value={filters.date_to || ""}
            onChange={(e) => handleInputChange("date_to", e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2 lg:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Active Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.search && (
          <span className="chip">
            Search: "{filters.search}"
            <button onClick={() => handleInputChange("search", "")}>×</button>
          </span>
        )}
        {filters.source && (
          <span className="chip">
            Source: {normalizedSources.find(s => s.slug === filters.source)?.name || filters.source}
            <button onClick={() => handleInputChange("source", "")}>×</button>
          </span>
        )}
        {filters.date_from && (
          <span className="chip">
            From: {filters.date_from}
            <button onClick={() => handleInputChange("date_from", "")}>×</button>
          </span>
        )}
        {filters.date_to && (
          <span className="chip">
            To: {filters.date_to}
            <button onClick={() => handleInputChange("date_to", "")}>×</button>
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
