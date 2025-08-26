import { ChevronDown, ChevronUp } from 'lucide-react'
import React from 'react'
import SalaryRangeSlider from '../../../components/SalaryRangeSlider'
import { CATEGORIES, JOB_TYPES } from '../../../utils/data';

const FilterSection = ({ title, children, isExpanded, onToggle }) => (
  <div className='border-b border-gray-200 pb-4 mb-4 last:border-b-0'>
    <button
      onClick={onToggle}
      className='flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors'
    >
      {title}
      {isExpanded ? (
        <ChevronUp className='w-4 h-4' />
      ) : (
        <ChevronDown className='w-4 h-4' />
      )}
    </button>
    {isExpanded && children}
  </div>
)

const FilterContent = ({
  toggleSection,
  clearAllFilters,
  handleFiltersChange,
  expandedSections,
  filters
}) => {

  return (
    <>
      <div className='flex items-center justify-between mb-6'>
        <button
          className='text-blue-600 hover:text-blue-700 font-semibold text-sm'
          onClick={clearAllFilters}
        >
          Clear All
        </button>
      </div>

      {/* Job Type */}
      <FilterSection
        title="Job Type"
        isExpanded={expandedSections?.jobType}
        onToggle={() => toggleSection('jobType')}
      >
        <div className='space-y-3'>
          {JOB_TYPES.map((type) => (
            <label key={type.value} className='flex items-center cursor-pointer'>
              <input
                type="checkbox"
                className='rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                checked={filters?.type?.includes(type.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleFiltersChange("type", [...(filters.type || []), type.value])
                  } else {
                    handleFiltersChange("type", filters.type.filter(v => v !== type.value))
                  }
                }}
              />
              <span className='ml-3 text-gray-700 font-medium'>{type.value}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Salary */}
      <FilterSection
        title="Salary Range"
        isExpanded={expandedSections?.salary}
        onToggle={() => toggleSection('salary')}
      >
        <SalaryRangeSlider filters={filters} handleFilterChange={handleFiltersChange} />
      </FilterSection>

      {/* Categories */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections?.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className='space-y-3'>
          {CATEGORIES.map((cat) => (
            <label key={cat.value} className='flex items-center cursor-pointer'>
              <input
                type="checkbox"
                className='rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                checked={filters?.category?.includes(cat.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleFiltersChange("category", [...(filters.category || []), cat.value])
                  } else {
                    handleFiltersChange("category", filters.category.filter(v => v !== cat.value))
                  }
                }}
              />
              <span className='ml-3 text-gray-700 font-medium'>{cat.value}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </>
  )
}

export default FilterContent
