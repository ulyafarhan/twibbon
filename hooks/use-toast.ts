'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'danger';
};

const toastList: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

function emitChange() {
  listeners.forEach((listener) => listener([...toastList]));
}

export function toast({ title, description, variant }: Omit<Toast, 'id'>) {
  const id = uuidv4();
  toastList.push({ id, title, description, variant });
  emitChange();
  
  setTimeout(() => {
    const index = toastList.findIndex((t) => t.id === id);
    if (index > -1) {
      toastList.splice(index, 1);
      emitChange();
    }
  }, 5000); // Durasi toast 5 detik
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastList);

  const dismiss = useCallback((id: string) => {
    const index = toastList.findIndex((t) => t.id === id);
    if (index > -1) {
      toastList.splice(index, 1);
      emitChange();
    }
  }, []);

  const clear = useCallback(() => {
    toastList.splice(0, toastList.length);
    emitChange();
  }, []);

  useState(() => {
    const onChange = (newToasts: Toast[]) => {
      setToasts(newToasts);
    };
    listeners.push(onChange);
    return () => {
      const index = listeners.indexOf(onChange);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  return {
    toasts,
    toast,
    dismiss,
    clear
  };
}