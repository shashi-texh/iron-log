import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatWeight, formatDate, formatCurrency, calculate1RM, getLiftDisplayName, getLiftIcon } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { Dumbbell, ShoppingCart, CheckSquare, Trophy, TrendingUp, Target, Plus, Clock, Dumbbell as DumbbellIcon, Package } from 'lucide-react';

export function DashboardPage() {
  const { prs, todos, cart, profile, getBestPR, getTotalWeight, getWilksScore, getActiveTodos, getCompletedTodos } = useApp();

  const total = getTotalWeight();
  const wilks = getWilksScore();
  const activeTodos = getActiveTodos();
  const completedTodos = getCompletedTodos();
  const recentPRs = [...prs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const upcomingTasks = [...activeTodos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  }).slice(0, 3);

  const stats = useMemo(() => [
    {
      label: 'Big Three Total',
      value: total > 0 ? formatWeight(total, profile.unit) : '—',
      icon: Trophy,
      color: 'var(--color-warning)',
      bg: 'rgba(243, 156, 18, 0.1)',
      href: '/powerlifting',
    },
    {
      label: 'Wilks Score',
      value: wilks > 0 ? String(wilks) : '—',
      icon: Target,
      color: 'var(--color-accent)',
      bg: 'rgba(233, 69, 96, 0.1)',
      href: '/powerlifting',
    },
    {
      label: 'Total PRs',
      value: String(prs.length),
      icon: DumbbellIcon,
      color: 'var(--color-success)',
      bg: 'rgba(46, 204, 113, 0.1)',
      href: '/powerlifting',
    },
    {
      label: 'Active Tasks',
      value: String(activeTodos.length),
      icon: CheckSquare,
      color: '#3498db',
      bg: 'rgba(52, 152, 219, 0.1)',
      href: '/todo',
    },
  ], [total, wilks, prs.length, activeTodos.length, profile.unit]);

  const quickActions = [
    { label: 'Add PR', icon: Plus, href: '/powerlifting', color: 'var(--color-accent)' },
    { label: 'New Task', icon: Plus, href: '/todo', color: 'var(--color-success)' },
    { label: 'Shop Supplements', icon: ShoppingCart, href: '/shop', color: 'var(--color-warning)' },
  ];

  return (
    <div className="page dashboard-page">
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>Welcome back, {profile.name || 'Athlete'}</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Here's your fitness overview</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/profile" className="btn btn-secondary">Profile</Link>
            <Link to="/settings" className="btn btn-secondary">Settings</Link>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          {stats.map((stat, index) => (
            <Link key={index} to={stat.href} className="card stat-card" style={{ textDecoration: 'none', padding: '1.5rem', transition: 'all var(--transition-base)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </span>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.2 }}>
                {stat.value}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DumbbellIcon size={20} style={{ color: 'var(--color-accent)' }} />
                Recent PRs
              </h3>
              <Link to="/powerlifting" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-accent)' }}>View All</Link>
            </div>

            {recentPRs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentPRs.map(pr => (
                  <div key={pr.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{getLiftIcon(pr.lift)}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{getLiftDisplayName(pr.lift)}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                          {formatDate(pr.date)} • {pr.reps > 1 ? `${pr.reps} reps` : '1RM'}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                        {formatWeight(pr.weight, pr.unit)}
                      </div>
                      {pr.reps > 1 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Est. 1RM: {calculate1RM(pr.weight, pr.reps)} {pr.unit}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                <DumbbellIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No PRs recorded yet</p>
                <Link to="/powerlifting" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  <Plus size={16} />
                  Add Your First PR
                </Link>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={20} style={{ color: 'var(--color-success)' }} />
                Upcoming Tasks
              </h3>
              <Link to="/todo" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-accent)' }}>View All</Link>
            </div>

            {upcomingTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingTasks.map(todo => (
                  <div key={todo.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${getCategoryColor(todo.category)}` }}>
                    <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-full)', border: '2px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.125rem' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{todo.title}</h4>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-full)',
                          background: `${getPriorityColor(todo.priority)}20`,
                          color: getPriorityColor(todo.priority),
                          textTransform: 'uppercase',
                        }}>
                          {getPriorityLabel(todo.priority)}
                        </span>
                      </div>
                      {todo.dueDate && (
                        <div style={{ fontSize: '0.75rem', color: new Date(todo.dueDate) < new Date() && !todo.completed ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
                          <Clock size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                          Due: {formatDate(todo.dueDate)} {new Date(todo.dueDate) < new Date() && !todo.completed ? '(OVERDUE)' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                <CheckSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No upcoming tasks</p>
                <Link to="/todo" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  <Plus size={16} />
                  Add a Task
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} style={{ color: 'var(--color-warning)' }} />
              Cart Summary
            </h3>
            <Link to="/shop" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-accent)' }}>View Cart</Link>
          </div>

          {cart.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.slice(0, 3).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </div>
                  </div>
                </div>
              ))}
              {cart.length > 3 && (
                <div style={{ textAlign: 'center', padding: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  +{cart.length - 3} more item{cart.length - 3 !== 1 ? 's' : ''}
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Cart Total</span>
                <Link to="/shop" className="btn btn-primary">
                  Checkout ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              <ShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Your cart is empty</p>
              <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                <Plus size={16} />
                Browse Supplements
              </Link>
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <action.icon size={18} style={{ color: action.color }} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    workout: 'var(--color-accent)',
    nutrition: 'var(--color-success)',
    recovery: '#3498db',
    general: 'var(--color-text-secondary)',
  };
  return colors[category] || colors.general;
}

function getPriorityColor(priority) {
  const colors = {
    low: 'var(--color-text-muted)',
    medium: 'var(--color-warning)',
    high: 'var(--color-error)',
  };
  return colors[priority] || colors.low;
}

function getPriorityLabel(priority) {
  const labels = { low: 'Low', medium: 'Medium', high: 'High' };
  return labels[priority] || priority;
}