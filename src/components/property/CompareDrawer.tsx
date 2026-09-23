import React from 'react';
import { useCms } from '../../context/CmsContext';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export const CompareDrawer: React.FC = () => {
  const {
    compareList,
    properties,
    removeFromCompare,
    clearCompare,
    navigate,
    isCompareDrawerOpen,
    setIsCompareDrawerOpen,
  } = useCms();

  if (compareList.length === 0 || !isCompareDrawerOpen) return null;

  const compareProperties = properties.filter((p) => compareList.includes(p.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F2433] text-white shadow-2xl border-t-2 border-[#C8A46B] py-3 px-4 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#C8A46B]" />
            <span className="text-sm font-semibold tracking-wide">
              Compare Properties ({compareList.length}/3)
            </span>
          </div>
          <button
            onClick={() => setIsCompareDrawerOpen(false)}
            className="sm:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Property Mini Cards */}
        <div className="flex items-center gap-3 overflow-x-auto max-w-full py-1">
          {compareProperties.map((prop) => (
            <div
              key={prop.id}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded border border-white/10 shrink-0"
            >
              <img
                src={prop.mainImage}
                alt={prop.title}
                className="w-8 h-8 rounded object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-semibold line-clamp-1 max-w-[120px] sm:max-w-[160px]">
                  {prop.title}
                </p>
                <p className="text-[11px] text-[#C8A46B] font-mono">
                  ${prop.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeFromCompare(prop.id)}
                className="p-1 hover:text-rose-400 text-white/60 ml-1 cursor-pointer"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {compareList.length < 3 && (
            <div className="hidden md:flex items-center justify-center px-3 py-1.5 border border-dashed border-white/20 rounded text-xs text-white/50">
              + Select up to {3 - compareList.length} more
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 cursor-pointer px-2 py-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
          <button
            onClick={() => {
              navigate({ name: 'compare' });
              setIsCompareDrawerOpen(false);
            }}
            className="bg-[#C8A46B] hover:bg-[#b8955b] text-[#0F2433] text-xs font-bold tracking-wider uppercase px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
