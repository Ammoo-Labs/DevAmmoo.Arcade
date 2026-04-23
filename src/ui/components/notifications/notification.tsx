import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  type: NotificationType;
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

const notificationStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-400',
    iconComponent: CheckCircle
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-400',
    iconComponent: XCircle
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-400',
    iconComponent: AlertCircle
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-400',
    iconComponent: Info
  }
};

export default function Notification({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  duration = 5000,
  className = ''
}: NotificationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);

  const styles = notificationStyles[type];
  const IconComponent = styles.iconComponent;

  React.useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Animation duration
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        relative border rounded-lg p-4 transition-all duration-300 ease-in-out
        ${styles.container}
        ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${styles.icon}`} />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm">
            {message}
          </p>
        </div>

        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={handleClose}
              className={`
                inline-flex rounded-md p-1.5 transition-colors duration-200
                ${styles.icon} hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
              `}
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}