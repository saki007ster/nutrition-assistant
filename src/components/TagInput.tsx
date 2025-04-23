import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  label: string;
  id: string;
}

export default function TagInput({ tags, onTagsChange, placeholder, icon, label, id }: TagInputProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      onTagsChange([...tags, trimmedInput]);
    }
    setInput('');
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Handle clicking outside to add the current input as a tag
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (input.trim()) {
          addTag();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [input]);

  return (
    <div className="space-y-1">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 flex items-center gap-2"
      >
        {icon}
        {label}
      </label>
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`min-h-[3rem] p-2 border rounded-lg bg-white/80 backdrop-blur-sm transition-colors flex flex-wrap gap-2 items-center cursor-text ${
          isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-blue-100'
        }`}
        role="presentation"
      >
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.span
              key={`${tag}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={inputRef}
          id={id}
          type="text"
          className="flex-1 min-w-[8rem] bg-transparent border-none focus:outline-none p-1 text-gray-700 placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={tags.length === 0 ? placeholder : ''}
          aria-label={`Add ${label}`}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Enter or comma to add a new item
      </p>
    </div>
  );
} 