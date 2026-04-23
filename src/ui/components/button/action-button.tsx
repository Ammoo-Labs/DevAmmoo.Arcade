import Button from './button';
import { ButtonHTMLAttributes } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function ActionButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  ...props 
}: ActionButtonProps) {
  return (
    <Button variant={variant} size={size} {...props}>
      {children}
    </Button>
  );
}