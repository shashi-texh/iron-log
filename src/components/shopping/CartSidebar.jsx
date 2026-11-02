import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { showToast } from '../ui/Toast';
import { Trash2, Minus, Plus, Check } from 'lucide-react';

export function CartSidebar({ isOpen, onClose }) {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useApp();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    clearCart();
    onClose();
    showToast('Order placed! This is a demo checkout.', 'success');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ background: 'rgba(0,0,0,0.3)' }} />
      <div className="modal-content" style={{ maxWidth: '480px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Shopping Cart</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style={{ marginBottom: '1rem' }}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h3 style={{ marginBottom: '0.5rem' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Add some supplements to get started</p>
            <button onClick={onClose} className="btn btn-primary">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                    {item.variant && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{item.variant}</p>
                    )}
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="btn btn-ghost"
                        style={{ width: 32, height: 32, padding: 0 }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 500, fontSize: '0.875rem' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="btn btn-ghost"
                        style={{ width: 32, height: 32, padding: 0 }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-ghost"
                      style={{ padding: '0.25rem', color: 'var(--color-text-muted)' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{formatCurrency(getCartTotal())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <span>Shipping</span>
                <span>{getCartTotal() >= 75 ? 'FREE' : formatCurrency(9.99)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>
                <span>Total</span>
                <span>{formatCurrency(getCartTotal() + (getCartTotal() >= 75 ? 0 : 9.99))}</span>
              </div>

              {getCartTotal() < 75 && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-accent)', textAlign: 'center' }}>
                  Add {formatCurrency(75 - getCartTotal())} more for FREE shipping!
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                  Continue Shopping
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCheckout}>
                  <Check size={18} />
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}