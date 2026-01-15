import { useContext } from 'react';
import { NotificationContext, ToastSeverity } from '@/context/NotificationContext';

export function useToast() {
  const { showToast } = useContext(NotificationContext);

  return {
    showToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info'),
  };
}
