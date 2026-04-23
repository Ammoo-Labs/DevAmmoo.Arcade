import Button from './button';
import { ButtonHTMLAttributes } from 'react';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'submit' | 'cancel' | 'reset';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function FormButton({ 
  variant = 'submit',
  size = 'md',
  children,
  type,
  ...props 
}: FormButtonProps) {
  const getVariant = () => {
    switch (variant) {
      case 'submit':
        return 'primary';
      case 'cancel':
        return 'outline';
      case 'reset':
        return 'ghost';
      default:
        return 'primary';
    }
  };

  const getType = () => {
    if (type) return type;
    switch (variant) {
      case 'submit':
        return 'submit';
      case 'reset':
        return 'reset';
      default:
        return 'button';
    }
  };

  return (
    <Button 
      variant={getVariant()} 
      size={size} 
      type={getType()}
      {...props}
    >
      {children}
    </Button>
  );
}