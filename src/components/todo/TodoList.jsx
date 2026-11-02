import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TodoItem } from './TodoItem';
import { getCategoryLabel, getCategoryColor, getPriorityColor, getPriorityLabel } from '../../utils/helpers';
import { Filter, ChevronDown, CheckCircle, Circle, Flag, Plus } from 'lucide-react';

export function TodoList() {
  const { todos, deleteTodo, toggleTodo, getTodosByCategory, getActiveTodos, getCompletedTodos } = useApp();
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categories = ['workout', 'nutrition', 'recovery', 'general'];

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (filter === 'active') result = result.filter(t => !t.completed);
    else if (filter === 'completed') result = result.filter(t => t.completed);

    if (categoryFilter !== 'all') result = result.filter(t => t.category === categoryFilter);

    if (!showCompleted) result = result.filter(t => !t.completed);

    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'dueDate':
        return result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case 'created':
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'category':
        return result.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return result;
    }
  }, [todos, filter, categoryFilter, sortBy, showCompleted]);

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  if (todos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
        <h3 style={{ marginBottom: '0.5rem' }}>No Tasks Yet</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Add your first task to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize' }}
            >
              {f} ({f === 'all' ? todos.length : f === 'active' ? activeCount : completedCount})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <button className="btn btn-secondary" onClick={() => setIsCategoryOpen(open => !open)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem' }}>
              <Filter size={18} />
              <span>{categoryFilter === 'all' ? 'All Categories' : getCategoryLabel(categoryFilter)}</span>
              <ChevronDown size={16} />
            </button>
            {isCategoryOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              minWidth: 200,
              zIndex: 100,
              overflow: 'hidden',
            }}>
              <button
                onClick={() => { setCategoryFilter('all'); setIsCategoryOpen(false); }}
                className={`btn ${categoryFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setIsCategoryOpen(false); }}
                  className={`btn ${categoryFilter === cat ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: 'var(--radius-full)', background: getCategoryColor(cat) }} />
                  <span>{getCategoryLabel(cat)}</span>
                </button>
              ))}
            </div>
            )}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field"
            style={{ width: 'auto', padding: '0.625rem 2rem 0.625rem 1rem', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b6b7a%27 stroke-width=%272%27%3E%3Cpolyline points=%276 9 12 15 18 9%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="created">Newest First</option>
            <option value="category">Category</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={e => setShowCompleted(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
            />
            Show Completed
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onEdit={todo => window.dispatchEvent(new CustomEvent('editTodo', { detail: todo }))}
            onDelete={id => { if (confirm('Delete this task?')) deleteTodo(id); }}
          />
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          <Filter size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No tasks match your filters</p>
        </div>
      )}
    </div>
  );
}