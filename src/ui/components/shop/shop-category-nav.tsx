"use client";

import { shopClasses } from './shop-colors';

interface ShopCategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ShopCategoryNav({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: ShopCategoryNavProps) {
  // Define the main categories we want to display
  const mainCategories = ["Men", "Women", "Unisex"];
  
  // Find other categories that are not in the main list
  const otherCategories = categories?.filter(cat => 
    !mainCategories.includes(cat) && 
    cat.toLowerCase() !== "all"
  ) || [];

  return (
    <div className={`${shopClasses.bg.primary} shadow-sm sticky top-16 z-10`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 py-4 overflow-x-auto pl-8">
          <button
            onClick={() => onCategoryChange("All")}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === "All" 
                ? 'bg-black text-white' 
                : 'bg-transparent text-gray-700 hover:text-black hover:bg-gray-100'
            }`}
          >
            All
          </button>
          
          {/* Main Categories */}
          {mainCategories.map((category: string) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === category 
                  ? 'bg-black text-white' 
                  : 'bg-transparent text-gray-700 hover:text-black hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
          
          {/* Other Categories Button */}
          {otherCategories.length > 0 && (
            <button
              onClick={() => onCategoryChange("Other")}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === "Other" 
                  ? 'bg-black text-white' 
                  : 'bg-transparent text-gray-700 hover:text-black hover:bg-gray-100'
              }`}
            >
              Other
            </button>
          )}
        </div>
      </div>
    </div>
  );
}