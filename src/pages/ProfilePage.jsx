import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatWeight } from '../utils/helpers';
import { Save, User, Dumbbell, Target, Scale, AlertCircle, CheckCircle } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-1 year)', description: 'New to lifting, learning form' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)', description: 'Consistent training, decent strength base' },
  { value: 'advanced', label: 'Advanced (3-5 years)', description: 'Strong foundation, specialized training' },
  { value: 'elite', label: 'Elite (5+ years)', description: 'Competitive level, peak performance' },
];

const GOALS = [
  'Strength', 'Hypertrophy', 'Powerlifting', 'Bodybuilding',
  'Weight Loss', 'Muscle Gain', 'Athletic Performance', 'General Health',
  'Competition Prep', 'Injury Rehab',
];

export function ProfilePage() {
  const { profile, updateProfile, prs, getTotalWeight, getWilksScore, clearPRs, clearTodos, clearCart, resetProfile, resetAll } = useApp();
  const [formData, setFormData] = useState({
    name: profile.name || '',
    unit: profile.unit || 'kg',
    bodyweight: profile.bodyweight || '',
    height: profile.height || '',
    age: profile.age || '',
    gender: profile.gender || '',
    experience: profile.experience || 'beginner',
    goals: profile.goals || [],
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleResetDefaults = () => {
    if (!confirm('Reset your profile to defaults? Name, body stats, and goals will be cleared.')) return;
    resetProfile();
    setFormData({
      name: '',
      unit: 'kg',
      bodyweight: '',
      height: '',
      age: '',
      gender: '',
      experience: 'beginner',
      goals: [],
    });
    setErrors({});
    showToast('Profile reset to defaults', 'info');
  };

  const handleClearPRs = () => {
    if (!confirm('Delete ALL personal records? This cannot be undone.')) return;
    clearPRs();
    showToast('All PRs cleared', 'info');
  };

  const handleClearTodos = () => {
    if (!confirm('Delete ALL tasks? This cannot be undone.')) return;
    clearTodos();
    showToast('All tasks cleared', 'info');
  };

  const handleClearCart = () => {
    if (!confirm('Remove all items from your cart?')) return;
    clearCart();
    showToast('Cart cleared', 'info');
  };

  const handleDeleteAccount = () => {
    if (!confirm('Delete all your data (PRs, tasks, cart, profile)? This cannot be undone.')) return;
    resetAll();
    setFormData({
      name: '',
      unit: 'kg',
      bodyweight: '',
      height: '',
      age: '',
      gender: '',
      experience: 'beginner',
      goals: [],
    });
    showToast('All data deleted', 'info');
  };

  const validate = () => {    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.bodyweight && (parseFloat(formData.bodyweight) < 30 || parseFloat(formData.bodyweight) > 300)) {
      newErrors.bodyweight = 'Please enter a valid bodyweight (30-300)';
    }
    if (formData.height && (parseInt(formData.height) < 100 || parseInt(formData.height) > 250)) {
      newErrors.height = 'Please enter a valid height (100-250 cm)';
    }
    if (formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 100)) {
      newErrors.age = 'Please enter a valid age (13-100)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: formData.name.trim(),
      unit: formData.unit,
      bodyweight: formData.bodyweight ? parseFloat(formData.bodyweight) : undefined,
      height: formData.height ? parseInt(formData.height) : undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: formData.gender || undefined,
      experience: formData.experience,
      goals: formData.goals,
    };

    updateProfile(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const total = getTotalWeight();
  const wilks = getWilksScore();

  return (
    <div className="page profile-page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.25rem' }}>Profile & Settings</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage your profile, preferences, and lifting stats</p>
        </div>

        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'rgba(46, 204, 113, 0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--color-success)' }}>
            <CheckCircle size={20} />
            Profile saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} style={{ color: 'var(--color-accent)' }} />
              Basic Information
            </h2>

            <div className="input-group">
              <label className="input-label">Name</label>
              <input
                type="text"
                className={`input-field ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Your name"
              />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Unit System</label>
                <select className="input-field" value={formData.unit} onChange={e => handleChange('unit', e.target.value)}>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Gender</label>
                <select className="input-field" value={formData.gender} onChange={e => handleChange('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Bodyweight ({formData.unit})</label>
                <input
                  type="number"
                  step="0.1"
                  className={`input-field ${errors.bodyweight ? 'error' : ''}`}
                  value={formData.bodyweight}
                  onChange={e => handleChange('bodyweight', e.target.value)}
                  placeholder="e.g., 80"
                />
                {errors.bodyweight && <span className="input-error">{errors.bodyweight}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Height (cm)</label>
                <input
                  type="number"
                  className={`input-field ${errors.height ? 'error' : ''}`}
                  value={formData.height}
                  onChange={e => handleChange('height', e.target.value)}
                  placeholder="e.g., 175"
                />
                {errors.height && <span className="input-error">{errors.height}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Age</label>
                <input
                  type="number"
                  className={`input-field ${errors.age ? 'error' : ''}`}
                  value={formData.age}
                  onChange={e => handleChange('age', e.target.value)}
                  placeholder="e.g., 25"
                />
                {errors.age && <span className="input-error">{errors.age}</span>}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Dumbbell size={20} style={{ color: 'var(--color-accent)' }} />
              Training Profile
            </h2>

            <div className="input-group">
              <label className="input-label">Experience Level</label>
              <select className="input-field" value={formData.experience} onChange={e => handleChange('experience', e.target.value)}>
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Training Goals</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {GOALS.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`badge ${formData.goals.includes(goal) ? 'badge-primary' : ''}`}
                    style={{
                      background: formData.goals.includes(goal) ? 'var(--color-accent)' : 'var(--color-border)',
                      color: formData.goals.includes(goal) ? 'white' : 'var(--color-text)',
                      border: formData.goals.includes(goal) ? 'none' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      padding: '0.375rem 0.875rem',
                    }}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {prs.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} style={{ color: 'var(--color-accent)' }} />
                Current Stats
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {total > 0 ? formatWeight(total, profile.unit) : '—'}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Big Three Total</div>
                </div>

                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: wilks > 0 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    {wilks > 0 ? wilks : '—'}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Wilks Score</div>
                  {wilks === 0 && formData.bodyweight && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Add bodyweight & gender to calculate
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {prs.length}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Total PRs Logged</div>
                </div>

                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-bg-hover)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-warning)' }}>
                    {new Set(prs.map(p => p.lift)).size}
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Different Lifts</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={handleResetDefaults}>Reset to Defaults</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>

        <div className="card" style={{ padding: '1.5rem', marginTop: '2rem', border: '1px solid var(--color-error)', background: 'rgba(231, 76, 60, 0.05)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)' }}>
            <AlertCircle size={20} />
            Danger Zone
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            These actions are irreversible. Please proceed with caution.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" style={{ color: 'var(--color-error)' }} onClick={handleClearPRs}>Clear All PRs</button>
            <button className="btn btn-ghost" style={{ color: 'var(--color-error)' }} onClick={handleClearTodos}>Clear All Tasks</button>
            <button className="btn btn-ghost" style={{ color: 'var(--color-error)' }} onClick={handleClearCart}>Clear Cart</button>
            <button className="btn btn-ghost" style={{ color: 'var(--color-error)' }} onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}