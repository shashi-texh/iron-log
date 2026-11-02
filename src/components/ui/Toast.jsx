import { useEffect } from 'react';
import { X } from 'lucide-react';

export function ToastItem({ toast, onDismiss }) {
  const icons = {
    success: <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓</span>,
    error: <span style={{ color: 'var(--color-error)', fontWeight: 700 }}>!</span>,
    info: <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>i</span>,
  };

  return (
    <div className={`toast toast-${toast.type}`} style={{ position: 'relative' }}>
      {icons[toast.type] || icons.info}
      <span style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }} aria-label="Dismiss">
        <X size={18} />
      </button>
    </div>
  );
}

/**
 * Root container for toasts. Listens for `showToast` events on window so any
 * component can trigger a notification without extra context plumbing.
 */
export function ToastContainer() {
  useEffect(() => {
    const handleToast = (event) => {
      const { message, type = 'info', duration = 4000 } = event.detail || {};
      if (message) showToast(message, type, duration);
    };
    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  return <div className="toast-container" id="toast-container" />;
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = 'position: relative;';

  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };

  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span style="flex: 1; font-size: 0.875rem;">${message}</span>
    <button style="color: var(--color-text-muted); padding: 0.25rem; background: none; border: none; cursor: pointer;" aria-label="Dismiss">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  toast.querySelector('button').onclick = () => toast.remove();
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}
