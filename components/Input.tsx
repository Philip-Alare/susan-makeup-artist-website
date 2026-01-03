import { ReactNode } from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  id?: string;
  required?: boolean;
  rightSlot?: ReactNode;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  label,
  id,
  required = false,
  rightSlot,
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm text-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all ${rightSlot ? 'pr-12' : ''} ${className}`}
        />
        {rightSlot}
      </div>
    </div>
  );
}

interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  label?: string;
  id?: string;
  rows?: number;
}

export function Textarea({
  placeholder,
  value,
  onChange,
  className = '',
  label,
  id,
  rows = 4,
}: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none ${className}`}
      />
    </div>
  );
}
