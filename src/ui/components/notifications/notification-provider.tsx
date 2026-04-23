import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationContainer from './notification-container';
import { NotificationProps } from './notification';

interface NotificationWithId extends NotificationProps {
  id: string;
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationProps, 'onClose'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  position = 'top-right',
  maxNotifications = 5
}) => {
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const showNotification = (notification: Omit<NotificationProps, 'onClose'>) => {
    const id = generateId();
    const newNotification: NotificationWithId = {
      ...notification,
      id,
      autoClose: notification.autoClose ?? true,
      duration: notification.duration ?? 5000
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });
  };

  const showSuccess = (message: string, title?: string) => {
    showNotification({ type: 'success', message, title });
  };

  const showError = (message: string, title?: string) => {
    showNotification({ type: 'error', message, title, autoClose: false });
  };

  const showWarning = (message: string, title?: string) => {
    showNotification({ type: 'warning', message, title });
  };

  const showInfo = (message: string, title?: string) => {
    showNotification({ type: 'info', message, title });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const contextValue: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position={position}
      />
    </NotificationContext.Provider>
  );
};