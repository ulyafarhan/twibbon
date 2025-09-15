'use client';

import React from 'react';
import { useToast } from '@/hooks/use-toast';

const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1050 }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show bg-${
            toast.variant === 'danger' ? 'danger' : 'success'
          } text-white`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              <strong className="me-auto">{toast.title}</strong>
              {toast.description && <p className="mb-0">{toast.description}</p>}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => dismiss(toast.id)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;