import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  align?: 'left' | 'right';
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, className = '', align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-2 rounded-lg text-sm font-bold text-slate-700 min-w-[140px] border border-transparent focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none"
      >
        <div className="flex items-center gap-2">
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`
            absolute top-full mt-2 w-full min-w-[180px] bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in
            ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}
          `}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                {option.icon}
                <span>{option.label}</span>
              </div>
              {value === option.value && <Check size={14} className="text-red-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;