import Button from './button';
import { ButtonHTMLAttributes } from 'react';
import { Heart, Share, Star, Bookmark } from 'lucide-react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: 'heart' | 'share' | 'star' | 'bookmark' | 'custom';
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  customIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function IconButton({ 
  icon,
  variant = 'ghost',
  size = 'md',
  isActive = false,
  customIcon,
  children,
  className,
  onClick,
  ...props 
}: IconButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick handler
    onClick?.(e);
    
    // Remove focus from the button to eliminate the outer border
    (e.target as HTMLButtonElement).blur();
  };
  const getIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    const iconClasses = `${iconSize} transition-all duration-200 ${
      isActive ? 'fill-black text-black' : 'text-black stroke-2'
    }`;
    
    switch (icon) {
      case 'heart':
        return <Heart className={iconClasses} />;
      case 'share':
        return <Share className={iconClasses} />;
      case 'star':
        return <Star className={iconClasses} />;
      case 'bookmark':
        return <Bookmark className={iconClasses} />;
      case 'custom':
        return customIcon;
      default:
        return null;
    }
  };

  const activeVariant = isActive && variant === 'ghost' ? 'secondary' : variant;

  return (
    <Button 
      variant={activeVariant} 
      size={size} 
      className={`${children ? '' : 'aspect-square p-2'} focus:outline-none focus:ring-0 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {getIcon()}
      {children}
    </Button>
  );
}