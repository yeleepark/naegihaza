'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

type TagInputProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
};

export default function TagInput({
  tags,
  onTagsChange,
  placeholder,
  maxTags = 100,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addTags = (value: string) => {
    const newNames = value
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (newNames.length === 0) return;

    const combined = [...tags, ...newNames].slice(0, maxTags);
    onTagsChange(combined);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTags(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes(',') || pasted.includes('\n')) {
      e.preventDefault();
      addTags(pasted);
    }
  };

  return (
    <div
      className="font-game w-full px-3 py-2 rounded-lg bg-white border-2 border-black text-black focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-text min-h-[120px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap gap-1.5 items-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 bg-yellow-200 border-2 border-black rounded-full px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3 stroke-[3]" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => {
            if (inputValue.trim()) addTags(inputValue);
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] outline-none bg-transparent text-sm py-1 placeholder-neutral-400"
        />
      </div>
    </div>
  );
}
