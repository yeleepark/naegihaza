import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({
  label,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-black">
        {label}
      </label>
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-white border-2 border-black
          text-black placeholder-neutral-400
          focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          transition-all duration-200
          font-medium
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
