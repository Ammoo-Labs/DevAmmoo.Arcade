import Button from './button';
import { ButtonHTMLAttributes } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface CartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'add' | 'remove' | 'cart';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  showIcon?: boolean;
}

export default function CartButton({ 
  variant = 'add',
  size = 'md',
  showIcon = true,
  children,
  ...props 
}: CartButtonProps) {
  const getContent = () => {
    switch (variant) {
      case 'add':
        return (
          <>
            {showIcon && <Plus className="w-4 h-4" />}
            {children || 'Add to Cart'}
          </>
        );
      case 'remove':
        return (
          <>
            {showIcon && <Minus className="w-4 h-4" />}
            {children || 'Remove'}
          </>
        );
      case 'cart':
        return (
          <>
            {showIcon && <ShoppingCart className="w-4 h-4" />}
            {children || 'View Cart'}
          </>
        );
      default:
        return children;
    }
  };

  const buttonVariant = variant === 'remove' ? 'outline' : 'primary';

  return (
    <Button variant={buttonVariant} size={size} {...props}>
      {getContent()}
    </Button>
  );
}