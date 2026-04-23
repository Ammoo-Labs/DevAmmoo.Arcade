import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900 focus:ring-black',
    secondary: 'bg-white text-black border-2 border-black hover:bg-gray-50 active:bg-gray-100 focus:ring-black',
    outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white active:bg-gray-900 focus:ring-black',
    ghost: 'bg-transparent text-black hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300',
    link: 'bg-transparent text-black underline-offset-4 hover:underline focus:ring-transparent'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}