// components/ui/SimpleSelect.tsx
"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export default function SimpleSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  disabled = false,
  error,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative w-full `} ref={dropdownRef}>
      {label && (
        <label className="md:text-xs text-[10px] text-black uppercase font-medium block mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Select ${label || 'option'}, currently ${selectedOption?.label || 'none'}`}
        disabled={disabled}
        className={`
          w-full border-[0.3px] border-gray-500 rounded-xl bg-white px-4 p-2 md:py-3
          flex items-center justify-between
          focus:outline-none focus:ring-1 focus:ring-black
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div className="flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span>{selectedOption.icon}</span>}
              <span className="text-black md:text-sm text-xs">
                {selectedOption.label}
              </span>
            </>
          ) : (
            <span
              className="text-black text-sm
        "
            >
              {placeholder}
            </span>
          )}
        </div>
        <span className="ml-2">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {/* Error message */}
      {error && <p className="text-xs text-[#FC2C47] mt-1">{error}</p>}
      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg h-45 max-h-60 overflow-y-auto">
          <div className="py-1">
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 border-b-[0.3px] border-gray-100 hover:bg-[#F3F6F4] flex items-center gap-2"
                >
                  {option.icon && <span>{option.icon}</span>}
                  <span className="text-black md:text-sm text-xs">
                    {option.label}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-black">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
