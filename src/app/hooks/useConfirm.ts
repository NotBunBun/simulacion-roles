import { useContext } from 'react';
import { NotificationContext, ConfirmConfig } from '@/context/NotificationContext';

export function useConfirm() {
  const { showConfirm } = useContext(NotificationContext);

  return {
    confirm: (config: ConfirmConfig) => showConfirm(config),
  };
}
