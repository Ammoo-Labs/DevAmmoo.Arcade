import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type InlineNotificationType = 'success' | 'error' | 'warning' | 'info';

export interface InlineNotificationProps {
  type: InlineNotificationType;
  message: string;
  className?: string;
  showIcon?: boolean;
}

const inlineNotificationStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-700',
    icon: 'text-green-500',
    iconComponent: CheckCircle
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-700',
    icon: 'text-red-500',
    iconComponent: AlertCircle
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    icon: 'text-yellow-500',
    iconComponent: AlertTriangle
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-700',
    icon: 'text-blue-500',
    iconComponent: Info
  }
};

export default function InlineNotification({
  type,
  message,
  className = '',
  showIcon = true
}: InlineNotificationProps) {
  const styles = inlineNotificationStyles[type];
  const IconComponent = styles.iconComponent;

  return (
    <div
      className={`
        border rounded-md p-3 text-sm transition-all duration-300 ease-in-out
        ${styles.container}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-2">
            <IconComponent className={`h-4 w-4 ${styles.icon}`} />
          </div>
        )}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}