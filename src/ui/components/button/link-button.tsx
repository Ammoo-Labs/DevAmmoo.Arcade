import Button from './button';
import { ButtonHTMLAttributes } from 'react';
import { ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: 'arrow-right' | 'arrow-left' | 'external' | 'none';
  children: React.ReactNode;
  external?: boolean;
}

export default function LinkButton({ 
  href,
  variant = 'link',
  size = 'md',
  icon = 'none',
  children,
  external = false,
  onClick,
  ...props 
}: LinkButtonProps) {
  const getIcon = () => {
    switch (icon) {
      case 'arrow-right':
        return <ArrowRight className="w-4 h-4" />;
      case 'arrow-left':
        return <ArrowLeft className="w-4 h-4" />;
      case 'external':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      if (external) {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} {...props}>
      {icon === 'arrow-left' && getIcon()}
      {children}
      {(icon === 'arrow-right' || icon === 'external') && getIcon()}
    </Button>
  );
}