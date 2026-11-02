import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Loader2, Calendar, Flag, Tag, AlertTriangle } from 'lucide-react';
import { getCategoryColor, getPriorityColor } from '../../utils/helpers';

const CATEGORIES = [
  { value: 'workout', label: 'Workout', icon: '🏋️', color: 'var(--color-accent)' },
  { value: 'nutrition', label: 'Nutrition', icon: '🥗', color: 'var(--color-success)' },
  { value: 'recovery', label: 'Recovery', icon: '😴', color: '#3498db' },
  { value: 'general', label: 'General', icon: '📋', color: 'var(--color-text-secondary)' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'var(--color-text-muted)' },
  { value: 'medium', label: 'Medium', color: 'var(--color-warning)' },
  { value: 'high', label: 'High', color: 'var(--color-error)' },
];

export function TodoForm({ initialData, onClose }) {
  const { addTodo, updateTodo } = useApp();
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'workout',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        category: initialData.category,
        priority: initialData.priority,
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'workout',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 300));

    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
    };

    if (isEditing) {
      updateTodo({ ...todoData, id: initialData.id, completed: initialData.completed, createdAt: initialData.createdAt, completedAt: initialData.completedAt });
      showToast('Task updated!', 'success');
    } else {
      addTodo(todoData);
      showToast('Task added!', 'success');
    }
    onClose();
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Task Title</label>
            <input
              type="text"
              className={`input-field ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="What do you need to do?"
              maxLength={100}
              autoFocus
            />
            {errors.title && <span className="input-error">{errors.title}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Description (Optional)</label>
            <textarea
              className="input-field"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Add details..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={e => handleChange('category', e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value} style={{ color: cat.color }}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Priority</label>
              <select
                className="input-field"
                value={formData.priority}
                onChange={e => handleChange('priority', e.target.value)}
              >
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value} style={{ color: p.color }}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Due Date (Optional)</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
              <input
                type="date"
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.dueDate}
                onChange={e => handleChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
              {isEditing ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function showToast(message, type) {
  window.dispatchEvent(new CustomEvent('showToast', { detail: { message, type } }));
}