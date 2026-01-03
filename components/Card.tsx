import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-card rounded-xl shadow-md border border-border overflow-hidden ${
        hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  depth?: boolean;
}

export function CardHeader({ children, className = '', depth = false }: CardHeaderProps) {
  return (
    <div
      className={`p-6 border-b border-border ${
        depth
          ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md'
          : 'bg-card'
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
