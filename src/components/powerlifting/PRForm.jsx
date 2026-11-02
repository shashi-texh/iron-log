import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const LIFTS = [
  { value: 'squat', label: 'Squat', icon: '🏋️' },
  { value: 'bench', label: 'Bench Press', icon: '💪' },
  { value: 'deadlift', label: 'Deadlift', icon: '🏋️‍♂️' },
  { value: 'overhead-press', label: 'Overhead Press', icon: '🏋️‍♀️' },
];

export function PRForm({ initialData, onClose }) {
  const { addPR, updatePR, profile } = useApp();
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    lift: 'squat',
    customLiftName: '',
    weight: '',
    unit: profile.unit,
    reps: 1,
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        lift: initialData.lift,
        customLiftName: initialData.customLiftName || '',
        weight: String(initialData.weight),
        unit: initialData.unit,
        reps: initialData.reps,
        date: initialData.date.split('T')[0],
        note: initialData.note || '',
      });
    } else {
      setFormData(prev => ({ ...prev, unit: profile.unit }));
    }
  }, [initialData, profile.unit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    if (!formData.reps || parseInt(formData.reps) < 1) {
      newErrors.reps = 'Reps must be at least 1';
    }
    if (formData.lift === 'custom' && !formData.customLiftName.trim()) {
      newErrors.customLiftName = 'Please enter a lift name';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 300));

    const prData = {
      lift: formData.lift,
      customLiftName: formData.lift === 'custom' ? formData.customLiftName : undefined,
      weight: parseFloat(formData.weight),
      unit: formData.unit,
      reps: parseInt(formData.reps),
      date: formData.date,
      note: formData.note.trim() || undefined,
    };

    if (isEditing) {
      updatePR({ ...prData, id: initialData.id });
      showToast('PR updated successfully!', 'success');
    } else {
      addPR(prData);
      showToast('New PR added! 💪', 'success');
    }
    onClose();
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const estimated1RM = formData.weight && formData.reps
    ? Math.round(parseFloat(formData.weight) * (1 + parseInt(formData.reps) / 30) * 10) / 10
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{isEditing ? 'Edit PR' : 'Add New PR'}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Lift</label>
            <select
              className="input-field"
              value={formData.lift}
              onChange={e => handleChange('lift', e.target.value)}
            >
              {LIFTS.map(lift => (
                <option key={lift.value} value={lift.value}>{lift.icon} {lift.label}</option>
              ))}
              <option value="custom">✏️ Custom Lift</option>
            </select>
          </div>

          {formData.lift === 'custom' && (
            <div className="input-group">
              <label className="input-label">Custom Lift Name</label>
              <input
                type="text"
                className={`input-field ${errors.customLiftName ? 'error' : ''}`}
                value={formData.customLiftName}
                onChange={e => handleChange('customLiftName', e.target.value)}
                placeholder="e.g., Front Squat, Incline Bench"
              />
              {errors.customLiftName && <span className="input-error">{errors.customLiftName}</span>}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Weight ({formData.unit})</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className={`input-field ${errors.weight ? 'error' : ''}`}
                value={formData.weight}
                onChange={e => handleChange('weight', e.target.value)}
                placeholder="e.g., 100"
              />
              {errors.weight && <span className="input-error">{errors.weight}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Reps</label>
              <input
                type="number"
                min="1"
                max="50"
                className={`input-field ${errors.reps ? 'error' : ''}`}
                value={formData.reps}
                onChange={e => handleChange('reps', e.target.value)}
              />
              {errors.reps && <span className="input-error">{errors.reps}</span>}
            </div>
          </div>

          {estimated1RM > 0 && formData.reps > 1 && (
            <div style={{ padding: '0.75rem', background: 'rgba(233, 69, 96, 0.1)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Est. 1RM:</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{estimated1RM} {formData.unit}</span>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Date</label>
            <input
              type="date"
              className="input-field"
              value={formData.date}
              onChange={e => handleChange('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Notes (Optional)</label>
            <textarea
              className="input-field"
              value={formData.note}
              onChange={e => handleChange('note', e.target.value)}
              placeholder="How did it feel? Equipment used, etc."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
              {isEditing ? 'Update PR' : 'Save PR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function showToast(message, type) {
  const event = new CustomEvent('showToast', { detail: { message, type } });
  window.dispatchEvent(event);
}