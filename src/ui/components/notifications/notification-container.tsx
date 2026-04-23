import React from 'react';
import Notification, { NotificationProps } from './notification';

interface NotificationContainerProps {
  notifications: (NotificationProps & { id: string })[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
};

export default function NotificationContainer({
  notifications,
  onRemove,
  position = 'top-right'
}: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return (
    <div className={`fixed z-50 ${positionClasses[position]} w-full max-w-sm space-y-2`}>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
}