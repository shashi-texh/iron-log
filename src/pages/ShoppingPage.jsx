import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductGrid } from '../components/shopping/ProductGrid';
import { CartSidebar } from '../components/shopping/CartSidebar';
import { Dumbbell, Sparkles, Shield, Truck } from 'lucide-react';

export function ShoppingPage() {
  const { getCartCount } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Products', icon: Dumbbell },
    { id: 'preworkout', label: 'Pre-Workouts', icon: Sparkles },
    { id: 'creatine', label: 'Creatine', icon: Shield },
    { id: 'protein', label: 'Protein', icon: Truck },
    { id: 'supplements', label: 'Supplements', icon: Dumbbell },
  ];

  return (
    <div className="page shopping-page">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Supplement Store</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Quality supplements to fuel your gains</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <ProductGrid initialCategory={activeTab === 'all' ? undefined : activeTab} />
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}