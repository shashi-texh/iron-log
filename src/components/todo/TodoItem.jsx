import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';
import { getCategoryColor, getCategoryLabel, getPriorityColor, getPriorityLabel } from '../../utils/helpers';
import { Trash2, Edit, CheckCircle, Flag, Calendar } from 'lucide-react';

export function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  const handleToggle = () => {
    onToggle?.(todo.id);
  };

  return (
    <div className={`card todo-item ${todo.completed ? 'completed' : ''}`} style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1rem',
      transition: 'all var(--transition-fast)',
      opacity: todo.completed ? 0.7 : 1,
      borderLeft: `4px solid ${getCategoryColor(todo.category)}`,
    }}>
      <button
        onClick={handleToggle}
        className="btn btn-icon"
        style={{ width: 24, height: 24, padding: 0, borderRadius: 'var(--radius-full)', border: `2px solid ${todo.completed ? 'var(--color-success)' : 'var(--color-border)'}`, background: todo.completed ? 'var(--color-success)' : 'transparent', color: 'var(--color-text-inverse)', flexShrink: 0, marginTop: '0.125rem' }}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && <CheckCircle size={16} />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: 600,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
          }}>
            {todo.title}
          </h4>
          <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
            {todo.priority !== 'low' && (
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
            )}
            <span style={{
              padding: '0.125rem 0.5rem',
              fontSize: '0.625rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              background: `${getCategoryColor(todo.category)}20`,
              color: getCategoryColor(todo.category),
              textTransform: 'uppercase',
            }}>
              {getCategoryLabel(todo.category)}
            </span>
          </div>
        </div>

        {todo.description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
            {todo.description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={12} />
            Created: {formatDate(todo.createdAt)}
          </span>
          {todo.dueDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isOverdue ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
              <Flag size={12} />
              Due: {formatDate(todo.dueDate)} {isOverdue && '(OVERDUE)'}
            </span>
          )}
          {todo.completed && todo.completedAt && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-success)' }}>
              <CheckCircle size={12} />
              Completed: {formatDate(todo.completedAt)}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
        <button
          onClick={() => onEdit?.(todo)}
          className="btn btn-ghost btn-icon"
          style={{ padding: '0.375rem', color: 'var(--color-text-muted)' }}
          aria-label="Edit todo"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete?.(todo.id)}
          className="btn btn-ghost btn-icon"
          style={{ padding: '0.375rem', color: 'var(--color-error)' }}
          aria-label="Delete todo"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}